import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import Nav from './nav';

jest.mock('@next/third-parties/google', () => ({
  GoogleAnalytics: jest.fn().mockReturnValue(null),
}));

const mockMatchMedia = (matches: boolean) => {
  const listeners: Array<(e: Partial<MediaQueryListEvent>) => void> = [];
  const mq = {
    matches,
    addEventListener: jest.fn((_, handler) => listeners.push(handler)),
    removeEventListener: jest.fn(),
  };
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockReturnValue(mq),
  });
  return {
    mq,
    triggerChange: (newMatches: boolean) =>
      listeners.forEach((h) => h({ matches: newMatches } as MediaQueryListEvent)),
  };
};

describe('Nav', () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it('renders the main navigation links', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'The Blog' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Music' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Politics' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Stocks' })).toBeInTheDocument();
  });

  it('renders the dropdown toggle buttons', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: 'Favourites', hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Wish Lists' })).toBeInTheDocument();
  });

  it('renders all Favourites dropdown links in the DOM', () => {
    const { container } = render(<Nav />);
    expect(container.querySelector('a[href="/favourite-movies"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/favourite-books"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/favourite-djs"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/favourite-cheese"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/favourite-beers"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/favourite-tracks"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/favourite-articles"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/favourite-restaurants"]')).toBeInTheDocument();
  });

  it('renders all Wish Lists dropdown links in the DOM', () => {
    const { container } = render(<Nav />);
    expect(container.querySelector('a[href="/holiday-wish-list"]')).toBeInTheDocument();
  });

  it('renders the Travel link', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: 'Travel' })).toBeInTheDocument();
  });

  it('links point to the correct hrefs', () => {
    const { container } = render(<Nav />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'The Blog' })).toHaveAttribute('href', '/blog');
    expect(screen.getByRole('link', { name: 'Music' })).toHaveAttribute('href', '/music');
    expect(container.querySelector('a[href="/favourite-movies"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/favourite-books"]')).toBeInTheDocument();
  });

  it('renders a burger menu button with 3 spans', () => {
    render(<Nav />);
    const nav = screen.getByRole('navigation');
    const burgerButton = nav.querySelector('button[aria-label="Toggle navigation menu"]');
    expect(burgerButton).toBeInTheDocument();
    expect(burgerButton?.querySelectorAll('span')).toHaveLength(3);
  });

  describe('burger menu', () => {
    it('toggles aria-expanded when burger button is clicked', () => {
      const { container } = render(<Nav />);
      const burgerButton = container.querySelector(
        'button[aria-label="Toggle navigation menu"]',
      ) as HTMLElement;
      expect(burgerButton).toBeInTheDocument();
      expect(burgerButton).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(burgerButton);
      expect(burgerButton).toHaveAttribute('aria-expanded', 'true');
      fireEvent.click(burgerButton);
      expect(burgerButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Favourites dropdown', () => {
    it('toggles open and closed when the arrow is clicked', () => {
      render(<Nav />);
      const arrow = screen.getByRole('button', { name: 'Toggle Favourites submenu' });
      expect(arrow).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(arrow);
      expect(arrow).toHaveAttribute('aria-expanded', 'true');
      fireEvent.click(arrow);
      expect(arrow).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens on mouse enter (desktop)', () => {
      render(<Nav />);
      const arrow = screen.getByRole('button', { name: 'Toggle Favourites submenu' });
      const dropdown = arrow.closest('[role="group"]')!.parentElement!;
      fireEvent.mouseEnter(dropdown);
      expect(screen.getByRole('button', { name: 'Toggle Favourites submenu' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    it('closes on mouse leave (desktop)', () => {
      render(<Nav />);
      const arrow = screen.getByRole('button', { name: 'Toggle Favourites submenu' });
      const dropdown = arrow.closest('[role="group"]')!.parentElement!;
      fireEvent.mouseEnter(dropdown);
      fireEvent.mouseLeave(dropdown);
      expect(arrow).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes on Escape key on the dropdown container', () => {
      render(<Nav />);
      const arrow = screen.getByRole('button', { name: 'Toggle Favourites submenu' });
      const dropdown = arrow.closest('[role="group"]')!.parentElement!;
      fireEvent.mouseEnter(dropdown);
      fireEvent.keyDown(dropdown, { key: 'Escape' });
      expect(arrow).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes on Escape key on the arrow button', () => {
      render(<Nav />);
      const arrow = screen.getByRole('button', { name: 'Toggle Favourites submenu' });
      fireEvent.click(arrow);
      expect(arrow).toHaveAttribute('aria-expanded', 'true');
      fireEvent.keyDown(arrow, { key: 'Escape' });
      expect(arrow).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Wish Lists dropdown', () => {
    it('toggles when the Wish Lists button is clicked', () => {
      const { container } = render(<Nav />);
      const wishListButton = screen.getByRole('button', { name: 'Wish Lists' });
      fireEvent.click(wishListButton);
      expect(screen.getByRole('link', { name: 'Holidays' })).toBeInTheDocument();
      fireEvent.click(wishListButton);
      expect(screen.queryByRole('link', { name: 'Holidays' })).not.toBeInTheDocument();
      expect(container.querySelector('a[href="/holiday-wish-list"]')).toBeInTheDocument();
    });

    it('toggles open and closed when the arrow is clicked', () => {
      render(<Nav />);
      const arrow = screen.getByRole('button', { name: 'Toggle Wish Lists submenu' });
      expect(arrow).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(arrow);
      expect(arrow).toHaveAttribute('aria-expanded', 'true');
      fireEvent.click(arrow);
      expect(arrow).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens on mouse enter (desktop)', () => {
      render(<Nav />);
      const wishListButton = screen.getByRole('button', { name: 'Wish Lists' });
      const dropdown = wishListButton.closest('[role="group"]')!.parentElement!;
      fireEvent.mouseEnter(dropdown);
      expect(screen.getByRole('button', { name: 'Wish Lists' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    it('closes on mouse leave (desktop)', () => {
      render(<Nav />);
      const wishListButton = screen.getByRole('button', { name: 'Wish Lists' });
      const dropdown = wishListButton.closest('[role="group"]')!.parentElement!;
      fireEvent.mouseEnter(dropdown);
      fireEvent.mouseLeave(dropdown);
      expect(wishListButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes on Escape key on the dropdown container', () => {
      render(<Nav />);
      const wishListButton = screen.getByRole('button', { name: 'Wish Lists' });
      const dropdown = wishListButton.closest('[role="group"]')!.parentElement!;
      fireEvent.mouseEnter(dropdown);
      fireEvent.keyDown(dropdown, { key: 'Escape' });
      expect(wishListButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes on Escape key on the arrow button', () => {
      render(<Nav />);
      const arrow = screen.getByRole('button', { name: 'Toggle Wish Lists submenu' });
      fireEvent.click(arrow);
      fireEvent.keyDown(arrow, { key: 'Escape' });
      expect(arrow).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Travel dropdown', () => {
    it('toggles open and closed when the arrow is clicked', () => {
      render(<Nav />);
      const arrow = screen.getByRole('button', { name: 'Toggle Travel submenu' });
      expect(arrow).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(arrow);
      expect(arrow).toHaveAttribute('aria-expanded', 'true');
      fireEvent.click(arrow);
      expect(arrow).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens on mouse enter (desktop)', () => {
      render(<Nav />);
      const arrow = screen.getByRole('button', { name: 'Toggle Travel submenu' });
      const dropdown = arrow.closest('[role="group"]')!.parentElement!;
      fireEvent.mouseEnter(dropdown);
      expect(arrow).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes on mouse leave (desktop)', () => {
      render(<Nav />);
      const arrow = screen.getByRole('button', { name: 'Toggle Travel submenu' });
      const dropdown = arrow.closest('[role="group"]')!.parentElement!;
      fireEvent.mouseEnter(dropdown);
      fireEvent.mouseLeave(dropdown);
      expect(arrow).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes on Escape key on the dropdown container', () => {
      render(<Nav />);
      const arrow = screen.getByRole('button', { name: 'Toggle Travel submenu' });
      const dropdown = arrow.closest('[role="group"]')!.parentElement!;
      fireEvent.mouseEnter(dropdown);
      fireEvent.keyDown(dropdown, { key: 'Escape' });
      expect(arrow).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes on Escape key on the arrow button', () => {
      render(<Nav />);
      const arrow = screen.getByRole('button', { name: 'Toggle Travel submenu' });
      fireEvent.click(arrow);
      fireEvent.keyDown(arrow, { key: 'Escape' });
      expect(arrow).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('mobile behaviour', () => {
    it('does not open dropdown on mouse enter when on mobile', () => {
      mockMatchMedia(true);
      render(<Nav />);
      const arrow = screen.getByRole('button', { name: 'Toggle Travel submenu', hidden: true });
      const dropdown = arrow.closest('[role="group"]')!.parentElement!;
      fireEvent.mouseEnter(dropdown);
      expect(arrow).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not close dropdown on mouse leave when on mobile', () => {
      mockMatchMedia(true);
      render(<Nav />);
      const arrow = screen.getByRole('button', { name: 'Toggle Travel submenu', hidden: true });
      fireEvent.click(arrow);
      const dropdown = arrow.closest('[role="group"]')!.parentElement!;
      fireEvent.mouseLeave(dropdown);
      expect(arrow).toHaveAttribute('aria-expanded', 'true');
    });

    it('updates isMobile state when media query changes', () => {
      const { triggerChange } = mockMatchMedia(false);
      render(<Nav />);
      const arrow = screen.getByRole('button', { name: 'Toggle Travel submenu' });
      const dropdown = arrow.closest('[role="group"]')!.parentElement!;
      fireEvent.mouseEnter(dropdown);
      expect(arrow).toHaveAttribute('aria-expanded', 'true');
      fireEvent.mouseLeave(dropdown);
      act(() => triggerChange(true));
      fireEvent.mouseEnter(dropdown);
      expect(arrow).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
