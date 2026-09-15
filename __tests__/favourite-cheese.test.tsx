import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import FavouritesPage from '../pages/favourite-cheese';

const mockRouter = { isFallback: false, asPath: '/favourite-cheese' };

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
  default: ({ title }: { title: string }) => <div data-testid="post-header">{title}</div>,
}));

jest.mock('../components/post-title', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="post-title">{children}</div>
  ),
}));

jest.mock('../components/share-bar', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="share-bar">{title}</div>,
}));

jest.mock('../components/favourites-hub-link', () => ({
  __esModule: true,
  default: () => <div data-testid="favourites-hub-link" />,
}));

jest.mock('../pages/favourites-results', () => ({
  __esModule: true,
  default: ({
    data,
    coverArtByTitle,
  }: {
    data: string[][] | null;
    coverArtByTitle?: Record<string, string | null>;
  }) => (
    <div data-testid="favourite-results">
      {JSON.stringify(data)}
      {JSON.stringify(coverArtByTitle)}
    </div>
  ),
}));

const sampleData = [
  ['Name', 'Notes'],
  ['Brie', 'Soft and creamy'],
  ['Cheddar', 'Sharp and firm'],
];

const coverArtByTitle = {
  Brie: null,
  Cheddar: null,
};

describe('FavouritesPage (favourite-cheese)', () => {
  beforeEach(() => {
    mockRouter.isFallback = false;
  });

  it('renders the loading state when router is falling back', () => {
    mockRouter.isFallback = true;
    render(<FavouritesPage data={sampleData} coverArtByTitle={coverArtByTitle} />);
    expect(screen.getByTestId('post-title')).toHaveTextContent('Loading…');
    expect(screen.queryByTestId('post-header')).not.toBeInTheDocument();
  });

  it('renders the page header with the favourite cheese title', () => {
    render(<FavouritesPage data={sampleData} coverArtByTitle={coverArtByTitle} />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('Favourite Cheese');
  });

  it('passes the sheet data and cover art through to FavouriteResults', () => {
    render(<FavouritesPage data={sampleData} coverArtByTitle={coverArtByTitle} />);
    expect(screen.getByTestId('favourite-results')).toHaveTextContent('Brie');
    expect(screen.getByTestId('favourite-results')).toHaveTextContent('Cheddar');
  });

  it('renders a share bar and the favourites hub link', () => {
    render(<FavouritesPage data={sampleData} coverArtByTitle={coverArtByTitle} />);
    expect(screen.getByTestId('share-bar')).toHaveTextContent('Favourite Cheese');
    expect(screen.getByTestId('favourites-hub-link')).toBeInTheDocument();
  });

  it('renders FavouriteResults with null data without crashing', () => {
    render(<FavouritesPage data={null} coverArtByTitle={{}} />);
    expect(screen.getByTestId('favourite-results')).toHaveTextContent('null');
  });
});
