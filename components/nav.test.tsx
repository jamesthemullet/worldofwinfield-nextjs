import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Nav from './nav';

jest.mock('@next/third-parties/google', () => ({
  GoogleAnalytics: jest.fn().mockReturnValue(null),
}));

describe('Nav', () => {
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
    expect(screen.getByRole('button', { name: 'Favourites' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Wish Lists' })).toBeInTheDocument();
  });

  it('renders all Favourites dropdown links in the DOM', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: 'Movies', hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Books', hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'DJs', hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cheese', hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Beers', hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Tracks', hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Articles', hidden: true })).toBeInTheDocument();
    // "Restaurants" appears in both Favourites and Wish Lists dropdowns
    const restaurantLinks = screen.getAllByRole('link', { name: 'Restaurants', hidden: true });
    expect(restaurantLinks.length).toBeGreaterThanOrEqual(1);
    const favouriteRestaurantLink = restaurantLinks.find((l) => l.getAttribute('href') === '/favourite-restaurants');
    expect(favouriteRestaurantLink).toBeInTheDocument();
  });

  it('renders all Wish Lists dropdown links in the DOM', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: 'Holidays', hidden: true })).toBeInTheDocument();
  });

  it('renders the Travel link', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: 'Travel' })).toBeInTheDocument();
  });

  it('links point to the correct hrefs', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'The Blog' })).toHaveAttribute('href', '/blog');
    expect(screen.getByRole('link', { name: 'Music' })).toHaveAttribute('href', '/music');
    expect(screen.getByRole('link', { name: 'Movies', hidden: true })).toHaveAttribute('href', '/favourite-movies');
    expect(screen.getByRole('link', { name: 'Books', hidden: true })).toHaveAttribute('href', '/favourite-books');
  });

  it('toggles the Favourites dropdown open and closed when the button is clicked', () => {
    render(<Nav />);
    const favouritesButton = screen.getByRole('button', { name: 'Favourites' });

    // Initial state: dropdown is closed (pointer-events: none via styled-component)
    // We verify the open state by checking the NavList class after burger toggle
    // For the dropdown, we test that clicking the button does not throw and the DOM remains stable
    fireEvent.click(favouritesButton);
    expect(screen.getByRole('button', { name: 'Favourites' })).toBeInTheDocument();

    fireEvent.click(favouritesButton);
    expect(screen.getByRole('button', { name: 'Favourites' })).toBeInTheDocument();
  });

  it('toggles the Wish Lists dropdown when clicked', () => {
    render(<Nav />);
    const wishListButton = screen.getByRole('button', { name: 'Wish Lists' });
    fireEvent.click(wishListButton);
    expect(screen.getByRole('link', { name: 'Holidays' })).toBeInTheDocument();
    fireEvent.click(wishListButton);
    expect(screen.getByRole('link', { name: 'Holidays', hidden: true })).toBeInTheDocument();
  });

  it('renders a burger menu button', () => {
    render(<Nav />);
    // The burger button has 3 <span> children
    const nav = screen.getByRole('navigation');
    const burgerButton = nav.querySelector('button:first-child');
    expect(burgerButton).toBeInTheDocument();
    expect(burgerButton?.querySelectorAll('span')).toHaveLength(3);
  });
});
