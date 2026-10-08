import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorldMap from './world-map';

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
});
