import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
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

  it('toggles the Favourites dropdown open and closed when the arrow is clicked', () => {
    render(<Nav />);
    const favouritesArrow = screen.getByRole('button', { name: 'Toggle Favourites submenu' });

    fireEvent.click(favouritesArrow);
    expect(screen.getByRole('button', { name: 'Toggle Favourites submenu' })).toBeInTheDocument();

    fireEvent.click(favouritesArrow);
    expect(screen.getByRole('button', { name: 'Toggle Favourites submenu' })).toBeInTheDocument();
  });

  it('toggles the Wish Lists dropdown when clicked', () => {
    const { container } = render(<Nav />);
    const wishListButton = screen.getByRole('button', { name: 'Wish Lists' });
    fireEvent.click(wishListButton);
    expect(screen.getByRole('link', { name: 'Holidays' })).toBeInTheDocument();
    fireEvent.click(wishListButton);
    expect(screen.queryByRole('link', { name: 'Holidays' })).not.toBeInTheDocument();
    expect(container.querySelector('a[href="/holiday-wish-list"]')).toBeInTheDocument();
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
