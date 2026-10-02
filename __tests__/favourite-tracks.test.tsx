import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import FavouritesPage from '../pages/favourite-tracks';

const mockRouter = { isFallback: false, asPath: '/favourite-tracks' };

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
    sortBy,
    genreFilter,
    labelFilter,
  }: {
    data: string[][] | null;
    sortBy?: string;
    genreFilter?: string;
    labelFilter?: string;
  }) => (
    <div data-testid="favourite-results">
      {JSON.stringify(data)}
      {`sortBy:${sortBy ?? ''}`}
      {`genreFilter:${genreFilter ?? ''}`}
      {`labelFilter:${labelFilter ?? ''}`}
    </div>
  ),
}));

const sampleData = [
  ['Artist/Track Name', 'Genre', 'Label', 'Year Released', 'Date Added'],
  ['Daft Punk - One More Time', 'House', 'Virgin', '2000', '2020-01-01'],
  ['Burial - Archangel', 'Dubstep', 'Hyperdub', '2007', '2020-02-01'],
];

describe('FavouritesPage (favourite-tracks)', () => {
  beforeEach(() => {
    mockRouter.isFallback = false;
  });

  it('renders the loading state when router is falling back', () => {
    mockRouter.isFallback = true;
    render(<FavouritesPage data={sampleData} />);
    expect(screen.getByTestId('post-title')).toHaveTextContent('Loading…');
    expect(screen.queryByTestId('post-header')).not.toBeInTheDocument();
  });

  it('renders the page header with the favourite tracks title', () => {
    render(<FavouritesPage data={sampleData} />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('Favourite Tracks');
  });

  it('renders genre, label and sort dropdowns populated from the sheet data', () => {
    render(<FavouritesPage data={sampleData} />);
    expect(screen.getByLabelText('Filter by genre:')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by label:')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort by:')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'House' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Hyperdub' })).toBeInTheDocument();
  });

  it('passes the sheet data through to FavouriteResults', () => {
    render(<FavouritesPage data={sampleData} />);
    expect(screen.getByTestId('favourite-results')).toHaveTextContent('Daft Punk - One More Time');
    expect(screen.getByTestId('favourite-results')).toHaveTextContent('Burial - Archangel');
  });

  it('updates the genre and label filters passed to FavouriteResults when a dropdown changes', () => {
    render(<FavouritesPage data={sampleData} />);

    fireEvent.change(screen.getByLabelText('Filter by genre:'), { target: { value: 'House' } });
    fireEvent.change(screen.getByLabelText('Filter by label:'), {
      target: { value: 'Hyperdub' },
    });

    expect(screen.getByTestId('favourite-results')).toHaveTextContent('genreFilter:House');
    expect(screen.getByTestId('favourite-results')).toHaveTextContent('labelFilter:Hyperdub');
  });

  it('defaults the sort dropdown to Artist/Track Name and updates it on change', () => {
    render(<FavouritesPage data={sampleData} />);

    expect(screen.getByTestId('favourite-results')).toHaveTextContent('sortBy:Artist/Track Name');

    fireEvent.change(screen.getByLabelText('Sort by:'), { target: { value: 'Year Released' } });

    expect(screen.getByTestId('favourite-results')).toHaveTextContent('sortBy:Year Released');
  });

  it('renders a share bar and the favourites hub link', () => {
    render(<FavouritesPage data={sampleData} />);
    expect(screen.getByTestId('share-bar')).toHaveTextContent('Favourite Tracks');
    expect(screen.getByTestId('favourites-hub-link')).toBeInTheDocument();
  });

  it('renders FavouriteResults with null data without crashing', () => {
    render(<FavouritesPage data={null} />);
    expect(screen.getByTestId('favourite-results')).toHaveTextContent('null');
  });
});
