import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import FavouriteResults from '../pages/favourites-results';

jest.mock('../lib/sheets', () => ({
  fetchDataFromGoogleSheets: jest.fn(),
}));

import { fetchDataFromGoogleSheets } from '../lib/sheets';

const mockFetch = fetchDataFromGoogleSheets as jest.Mock;

const sampleData = [
  ['Title', 'Author', 'Score'],
  ['Dune', 'Frank Herbert', '9'],
  ['Neuromancer', 'William Gibson', '8'],
  ['Foundation', 'Isaac Asimov', '7'],
];

describe('FavouriteResults search', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue(sampleData);
  });

  it('shows all rows when the search box is empty', async () => {
    render(<FavouriteResults sheetId="sheet-1" />);

    await waitFor(() => expect(screen.getByText('Dune')).toBeInTheDocument());
    expect(screen.getByText('Neuromancer')).toBeInTheDocument();
    expect(screen.getByText('Foundation')).toBeInTheDocument();
  });

  it('filters rows in real time as the user types, case-insensitively', async () => {
    render(<FavouriteResults sheetId="sheet-1" />);

    await waitFor(() => expect(screen.getByText('Dune')).toBeInTheDocument());

    const searchInput = screen.getByLabelText('Search:');
    fireEvent.change(searchInput, { target: { value: 'gibson' } });

    expect(screen.getByText('Neuromancer')).toBeInTheDocument();
    expect(screen.queryByText('Dune')).not.toBeInTheDocument();
    expect(screen.queryByText('Foundation')).not.toBeInTheDocument();
  });

  it('matches substrings against any column, not just the first', async () => {
    render(<FavouriteResults sheetId="sheet-1" />);

    await waitFor(() => expect(screen.getByText('Dune')).toBeInTheDocument());

    const searchInput = screen.getByLabelText('Search:');
    fireEvent.change(searchInput, { target: { value: 'asimov' } });

    expect(screen.getByText('Foundation')).toBeInTheDocument();
    expect(screen.queryByText('Dune')).not.toBeInTheDocument();
  });

  it('shows an empty state when there are no matches', async () => {
    render(<FavouriteResults sheetId="sheet-1" />);

    await waitFor(() => expect(screen.getByText('Dune')).toBeInTheDocument());

    const searchInput = screen.getByLabelText('Search:');
    fireEvent.change(searchInput, { target: { value: 'no such book' } });

    expect(screen.getByText(/No results for/)).toBeInTheDocument();
  });

  it('restores the full list when the search input is cleared', async () => {
    render(<FavouriteResults sheetId="sheet-1" />);

    await waitFor(() => expect(screen.getByText('Dune')).toBeInTheDocument());

    const searchInput = screen.getByLabelText('Search:');
    fireEvent.change(searchInput, { target: { value: 'gibson' } });
    expect(screen.queryByText('Dune')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: '' } });

    expect(screen.getByText('Dune')).toBeInTheDocument();
    expect(screen.getByText('Neuromancer')).toBeInTheDocument();
    expect(screen.getByText('Foundation')).toBeInTheDocument();
  });
});
