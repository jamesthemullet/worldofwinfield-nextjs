import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { fetchDataFromGoogleSheets } from '../lib/sheets';
import FavouriteResults from './favourites-results';

jest.mock('../lib/sheets', () => ({
  fetchDataFromGoogleSheets: jest.fn(),
}));

const mockedFetchData = fetchDataFromGoogleSheets as jest.MockedFunction<
  typeof fetchDataFromGoogleSheets
>;

const sheetData = [
  ['Title', 'Author', 'Score'],
  ['The Hobbit', 'J.R.R. Tolkien', '9'],
  ['Dune', 'Frank Herbert', '10'],
  ['Neuromancer', 'William Gibson', '8'],
];

describe('FavouriteResults search', () => {
  beforeEach(() => {
    mockedFetchData.mockReset();
    mockedFetchData.mockResolvedValue(sheetData);
  });

  it('renders a labelled search input once data has loaded', async () => {
    render(<FavouriteResults sheetId="sheet-id" />);
    await waitFor(() => expect(screen.getByLabelText('Search')).toBeInTheDocument());
  });

  it('filters rows to those matching the search query', async () => {
    render(<FavouriteResults sheetId="sheet-id" />);
    await waitFor(() => expect(screen.getByText('Dune')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'gibson' } });

    expect(screen.getByText('Neuromancer')).toBeInTheDocument();
    expect(screen.queryByText('Dune')).not.toBeInTheDocument();
    expect(screen.queryByText('The Hobbit')).not.toBeInTheDocument();
  });

  it('matches substrings case-insensitively across any column', async () => {
    render(<FavouriteResults sheetId="sheet-id" />);
    await waitFor(() => expect(screen.getByText('Dune')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'HOB' } });

    expect(screen.getByText('The Hobbit')).toBeInTheDocument();
    expect(screen.queryByText('Dune')).not.toBeInTheDocument();
  });

  it('shows an empty state and restores the full list when the query is cleared', async () => {
    render(<FavouriteResults sheetId="sheet-id" />);
    await waitFor(() => expect(screen.getByText('Dune')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'no such book' } });
    expect(screen.getByText(/No results for/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Search'), { target: { value: '' } });
    expect(screen.queryByText(/No results for/)).not.toBeInTheDocument();
    expect(screen.getByText('Dune')).toBeInTheDocument();
    expect(screen.getByText('The Hobbit')).toBeInTheDocument();
    expect(screen.getByText('Neuromancer')).toBeInTheDocument();
  });

  it('combines with an active genre filter', async () => {
    const genreData = [
      ['Title', 'Genre'],
      ['Song A', 'House'],
      ['Song B', 'Techno'],
      ['Song C', 'House'],
    ];
    mockedFetchData.mockResolvedValue(genreData);

    render(<FavouriteResults sheetId="sheet-id" genreFilter="House" />);
    await waitFor(() => expect(screen.getByText('Song A')).toBeInTheDocument());
    expect(screen.getByText('Song C')).toBeInTheDocument();
    expect(screen.queryByText('Song B')).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'song a' } });

    expect(screen.getByText('Song A')).toBeInTheDocument();
    expect(screen.queryByText('Song C')).not.toBeInTheDocument();
  });
});
