import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import FavouritesHubPage from '../pages/favourites';

jest.mock('../pages/_app', () => ({
  colours: {
    dark: '#291720',
    white: '#FFFFFF',
    pink: '#D90368',
    purple: '#8884FF',
    burgandy: '#820263',
    green: '#04A777',
    blueish: '#547AA5',
    azure: '#3185FC',
  },
}));

jest.mock('../components/layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/container', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/post-header', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

const allCounts: Record<string, number | null> = {
  Books: 42,
  Beers: 15,
  Cheese: 8,
  Cities: 20,
  Countries: 30,
  DJs: 5,
  Movies: 100,
  Restaurants: 25,
  Tracks: 200,
  Articles: 60,
};

describe('FavouritesHubPage', () => {
  it('renders a tile for every category', () => {
    render(<FavouritesHubPage counts={allCounts} />);
    const expectedCategories = [
      'Books',
      'Beers',
      'Cheese',
      'Cities',
      'Countries',
      'DJs',
      'Movies',
      'Restaurants',
      'Tracks',
      'Articles',
    ];
    for (const category of expectedCategories) {
      expect(screen.getByText(category)).toBeInTheDocument();
    }
  });

  it('shows the entry count when a count is available', () => {
    render(<FavouritesHubPage counts={allCounts} />);
    expect(screen.getByText('42 entries')).toBeInTheDocument();
    expect(screen.getByText('100 entries')).toBeInTheDocument();
  });

  it('shows "—" when a count is null', () => {
    const counts: Record<string, number | null> = {
      ...allCounts,
      Books: null,
    };
    render(<FavouritesHubPage counts={counts} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders a link to each category page', () => {
    render(<FavouritesHubPage counts={allCounts} />);
    expect(screen.getByRole('link', { name: /books/i })).toHaveAttribute('href', '/favourite-books');
    expect(screen.getByRole('link', { name: /movies/i })).toHaveAttribute(
      'href',
      '/favourite-movies',
    );
    expect(screen.getByRole('link', { name: /articles/i })).toHaveAttribute(
      'href',
      '/favourite-articles',
    );
  });

  it('renders the page heading', () => {
    render(<FavouritesHubPage counts={allCounts} />);
    expect(screen.getByRole('heading', { name: 'Favourites' })).toBeInTheDocument();
  });
});
