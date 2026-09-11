import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import FavouritesPage from '../pages/favourite-articles';

const mockRouter = { isFallback: false, asPath: '/favourite-articles' };

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
  ['About', 'Link'],
  ['Why Cats Rule The Internet', 'https://example.com/cats'],
  ['A Short History Of Tea', 'https://example.com/tea'],
];

const coverArtByTitle = {
  'Why Cats Rule The Internet': null,
  'A Short History Of Tea': null,
};

describe('FavouritesPage (favourite-articles)', () => {
  beforeEach(() => {
    mockRouter.isFallback = false;
  });

  it('renders the loading state when router is falling back', () => {
    mockRouter.isFallback = true;
    render(<FavouritesPage data={sampleData} coverArtByTitle={coverArtByTitle} />);
    expect(screen.getByTestId('post-title')).toHaveTextContent('Loading…');
    expect(screen.queryByTestId('post-header')).not.toBeInTheDocument();
  });

  it('renders the page header with the favourite articles title', () => {
    render(<FavouritesPage data={sampleData} coverArtByTitle={coverArtByTitle} />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('Favourite Articles Read');
  });

  it('passes the sheet data and cover art through to FavouriteResults', () => {
    render(<FavouritesPage data={sampleData} coverArtByTitle={coverArtByTitle} />);
    expect(screen.getByTestId('favourite-results')).toHaveTextContent('Why Cats Rule The Internet');
    expect(screen.getByTestId('favourite-results')).toHaveTextContent('A Short History Of Tea');
  });

  it('renders a share bar and the favourites hub link', () => {
    render(<FavouritesPage data={sampleData} coverArtByTitle={coverArtByTitle} />);
    expect(screen.getByTestId('share-bar')).toHaveTextContent('Favourite Articles Read');
    expect(screen.getByTestId('favourites-hub-link')).toBeInTheDocument();
  });

  it('renders FavouriteResults with null data without crashing', () => {
    render(<FavouritesPage data={null} coverArtByTitle={{}} />);
    expect(screen.getByTestId('favourite-results')).toHaveTextContent('null');
  });
});
