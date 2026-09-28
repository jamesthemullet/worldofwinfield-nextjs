import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import FavouriteBooksPage from '../pages/favourite-books';

const mockRouter = { isFallback: false, asPath: '/favourite-books' };

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
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

jest.mock('../components/post-title', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="post-title">{children}</div>
  ),
}));

jest.mock('../components/share-bar', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="share-bar" aria-label={title} />,
}));

jest.mock('../components/favourites-hub-link', () => ({
  __esModule: true,
  default: () => <a href="/favourites">All favourites</a>,
}));

jest.mock('../pages/favourites-results', () => ({
  __esModule: true,
  default: ({ data }: { data: string[][] | null }) => (
    <div data-testid="favourite-results">{data ? `${data.length} rows` : 'no data'}</div>
  ),
}));

const sampleData: string[][] = [
  ['Title', 'Author', 'Score'],
  ['Dune', 'Frank Herbert', '9'],
  ['Neuromancer', 'William Gibson', '8'],
];

const sampleCovers: Record<string, string | null> = {
  Dune: 'https://covers.example.com/dune.jpg',
  Neuromancer: null,
};

describe('FavouriteBooksPage', () => {
  beforeEach(() => {
    mockRouter.isFallback = false;
  });

  it('renders the page heading "Favourite Books"', () => {
    render(<FavouriteBooksPage data={sampleData} coverArtByTitle={sampleCovers} />);

    expect(screen.getByRole('heading', { name: 'Favourite Books' })).toBeInTheDocument();
  });

  it('shows "Loading…" and hides the heading when the router is falling back', () => {
    mockRouter.isFallback = true;
    render(<FavouriteBooksPage data={sampleData} coverArtByTitle={sampleCovers} />);

    expect(screen.getByTestId('post-title')).toHaveTextContent('Loading…');
    expect(screen.queryByRole('heading', { name: 'Favourite Books' })).not.toBeInTheDocument();
  });

  it('passes data to FavouriteResults and renders a share bar for the page', () => {
    render(<FavouriteBooksPage data={sampleData} coverArtByTitle={sampleCovers} />);

    expect(screen.getByTestId('favourite-results')).toHaveTextContent('3 rows');
    expect(screen.getByTestId('share-bar')).toHaveAttribute('aria-label', 'Favourite Books');
  });
});
