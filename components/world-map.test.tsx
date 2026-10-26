import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { LocationPost } from '../lib/types';
import WorldMap, { TOOLTIP_HIDE_DELAY_MS } from './world-map';

function makePost(slug: string, title: string, tagNames: string[]): LocationPost {
  return {
    slug,
    title,
    tags: { edges: tagNames.map((name) => ({ node: { name } })) },
  };
}

describe('WorldMap', () => {
  it('renders an accessible map container', () => {
    render(<WorldMap visitedCountries={['France']} />);
    expect(
      screen.getByLabelText(
        'World map with countries James has visited highlighted in purple and holiday wish list countries highlighted in blue',
      ),
    ).toBeInTheDocument();
  });

  it('includes an svg title for screen readers', () => {
    render(<WorldMap visitedCountries={['France']} />);
    expect(screen.getByText('Map of countries visited')).toBeInTheDocument();
  });

  it('marks a visited country as focusable and labelled', () => {
    render(<WorldMap visitedCountries={['France']} />);
    expect(screen.getByLabelText('France')).toBeInTheDocument();
  });

  it('gives a highlighted country an accessible role', () => {
    render(<WorldMap visitedCountries={['France']} />);
    expect(screen.getByLabelText('France')).toHaveAttribute('role', 'button');
  });

  it('only gives the single visited country a button role', () => {
    render(<WorldMap visitedCountries={['France']} />);
    const zoomButtons = screen.getAllByRole('button', { name: /zoom|reset/i });
    const countryButtons = screen
      .getAllByRole('button')
      .filter((element) => !zoomButtons.includes(element));
    expect(countryButtons).toHaveLength(1);
    expect(countryButtons[0]).toHaveAttribute('aria-label', 'France');
  });

  it('marks an aliased country name (USA) against the atlas name', () => {
    render(<WorldMap visitedCountries={['USA']} />);
    expect(screen.getByLabelText('United States of America')).toBeInTheDocument();
  });

  it('does not label unvisited countries', () => {
    render(<WorldMap visitedCountries={['France']} />);
    expect(screen.queryByLabelText('Germany')).not.toBeInTheDocument();
  });

  it('renders with no visited countries without crashing', () => {
    render(<WorldMap visitedCountries={[]} />);
    expect(screen.getByText('Map of countries visited')).toBeInTheDocument();
  });

  it('marks a wish-list country as focusable and labelled', () => {
    render(<WorldMap visitedCountries={[]} wishListCountries={['Japan']} />);
    expect(screen.getByLabelText('Japan (wish list)')).toBeInTheDocument();
  });

  it('treats a visited country as visited even if it is also on the wish list', () => {
    render(<WorldMap visitedCountries={['Japan']} wishListCountries={['Japan']} />);
    expect(screen.getByLabelText('Japan')).toBeInTheDocument();
    expect(screen.queryByLabelText('Japan (wish list)')).not.toBeInTheDocument();
  });

  it('renders with no wish-list countries without crashing', () => {
    render(<WorldMap visitedCountries={['France']} />);
    expect(screen.getByLabelText('France')).toBeInTheDocument();
  });

  it('shows a link to a post tagged with the hovered country', () => {
    const posts = [makePost('rome-trip', 'My Rome Trip', ['Italy'])];
    render(<WorldMap visitedCountries={['Italy']} posts={posts} />);

    fireEvent.mouseEnter(screen.getByLabelText('Italy'));

    const link = screen.getByRole('link', { name: 'My Rome Trip' });
    expect(link).toHaveAttribute('href', '/rome-trip');
  });

  it('matches a post tagged with the alias name against the atlas name', () => {
    const posts = [makePost('road-trip', 'American Road Trip', ['USA'])];
    render(<WorldMap visitedCountries={['USA']} posts={posts} />);

    fireEvent.mouseEnter(screen.getByLabelText('United States of America'));

    expect(screen.getByRole('link', { name: 'American Road Trip' })).toBeInTheDocument();
  });

  describe('tooltip persistence', () => {
    const posts = [makePost('rome-trip', 'My Rome Trip', ['Italy'])];

    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('hides the post link once the hide delay passes after leaving the country', () => {
      render(<WorldMap visitedCountries={['Italy']} posts={posts} />);

      const italy = screen.getByLabelText('Italy');
      fireEvent.mouseEnter(italy);
      fireEvent.mouseLeave(italy);
      expect(screen.getByRole('link', { name: 'My Rome Trip' })).toBeInTheDocument();

      act(() => jest.advanceTimersByTime(TOOLTIP_HIDE_DELAY_MS));
      expect(screen.queryByRole('link', { name: 'My Rome Trip' })).not.toBeInTheDocument();
    });

    it('keeps the tooltip open while the pointer is over it', () => {
      render(<WorldMap visitedCountries={['Italy']} posts={posts} />);

      const italy = screen.getByLabelText('Italy');
      fireEvent.mouseEnter(italy);
      fireEvent.mouseLeave(italy);
      fireEvent.mouseEnter(screen.getByRole('status'));

      act(() => jest.advanceTimersByTime(TOOLTIP_HIDE_DELAY_MS * 2));
      expect(screen.getByRole('link', { name: 'My Rome Trip' })).toBeInTheDocument();
    });

    it('pins the tooltip on click so hovering other countries does not replace it', () => {
      render(<WorldMap visitedCountries={['Italy', 'France']} posts={posts} />);

      const italy = screen.getByLabelText('Italy');
      fireEvent.click(italy);
      fireEvent.mouseLeave(italy);
      fireEvent.mouseEnter(screen.getByLabelText('France'));

      act(() => jest.advanceTimersByTime(TOOLTIP_HIDE_DELAY_MS * 2));
      expect(screen.getByRole('link', { name: 'My Rome Trip' })).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(screen.queryByRole('link', { name: 'My Rome Trip' })).not.toBeInTheDocument();
    });

    it('pins the tooltip with the Enter key', () => {
      render(<WorldMap visitedCountries={['Italy']} posts={posts} />);

      const italy = screen.getByLabelText('Italy');
      fireEvent.keyDown(italy, { key: 'Enter' });
      fireEvent.blur(italy);

      act(() => jest.advanceTimersByTime(TOOLTIP_HIDE_DELAY_MS * 2));
      expect(screen.getByRole('link', { name: 'My Rome Trip' })).toBeInTheDocument();
    });
  });

  it('shows no post links when nothing is tagged with the hovered country', () => {
    const posts = [makePost('unrelated', 'Unrelated Post', ['Music'])];
    render(<WorldMap visitedCountries={['Italy']} posts={posts} />);

    fireEvent.mouseEnter(screen.getByLabelText('Italy'));

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
