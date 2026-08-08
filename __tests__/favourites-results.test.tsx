import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import FavouriteResults from '../pages/favourites-results';

const sampleData = [
  ['Title', 'Author', 'Score'],
  ['Dune', 'Frank Herbert', '9'],
  ['Neuromancer', 'William Gibson', '8'],
  ['Foundation', 'Isaac Asimov', '7'],
];

describe('FavouriteResults search', () => {
  it('shows all rows when the search box is empty', () => {
    render(<FavouriteResults data={sampleData} />);

    expect(screen.getByText('Dune')).toBeInTheDocument();
    expect(screen.getByText('Neuromancer')).toBeInTheDocument();
    expect(screen.getByText('Foundation')).toBeInTheDocument();
  });

  it('filters rows in real time as the user types, case-insensitively', () => {
    render(<FavouriteResults data={sampleData} />);

    const searchInput = screen.getByLabelText('Search:');
    fireEvent.change(searchInput, { target: { value: 'gibson' } });

    expect(screen.getByText('Neuromancer')).toBeInTheDocument();
    expect(screen.queryByText('Dune')).not.toBeInTheDocument();
    expect(screen.queryByText('Foundation')).not.toBeInTheDocument();
  });

  it('matches substrings against any column, not just the first', () => {
    render(<FavouriteResults data={sampleData} />);

    const searchInput = screen.getByLabelText('Search:');
    fireEvent.change(searchInput, { target: { value: 'asimov' } });

    expect(screen.getByText('Foundation')).toBeInTheDocument();
    expect(screen.queryByText('Dune')).not.toBeInTheDocument();
  });

  it('shows an empty state when there are no matches', () => {
    render(<FavouriteResults data={sampleData} />);

    const searchInput = screen.getByLabelText('Search:');
    fireEvent.change(searchInput, { target: { value: 'no such book' } });

    expect(screen.getByText(/No results for/)).toBeInTheDocument();
  });

  it('restores the full list when the search input is cleared', () => {
    render(<FavouriteResults data={sampleData} />);

    const searchInput = screen.getByLabelText('Search:');
    fireEvent.change(searchInput, { target: { value: 'gibson' } });
    expect(screen.queryByText('Dune')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: '' } });

    expect(screen.getByText('Dune')).toBeInTheDocument();
    expect(screen.getByText('Neuromancer')).toBeInTheDocument();
    expect(screen.getByText('Foundation')).toBeInTheDocument();
  });

  it('renders nothing when data is null', () => {
    render(<FavouriteResults data={null} />);

    expect(screen.queryByText('Dune')).not.toBeInTheDocument();
  });
});

describe('FavouriteResults cover art grid', () => {
  const coverArtByTitle = {
    Dune: 'https://covers.openlibrary.org/b/id/1-M.jpg',
    Neuromancer: null,
    Foundation: null,
  };

  it('renders a cover grid instead of a table when coverArtByTitle is provided', () => {
    render(<FavouriteResults data={sampleData} coverArtByTitle={coverArtByTitle} />);

    expect(screen.getByAltText('Cover of Dune')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('keeps search working in grid mode', () => {
    render(<FavouriteResults data={sampleData} coverArtByTitle={coverArtByTitle} />);

    const searchInput = screen.getByLabelText('Search:');
    fireEvent.change(searchInput, { target: { value: 'gibson' } });

    expect(screen.getByText('Neuromancer')).toBeInTheDocument();
    expect(screen.queryByText('Dune')).not.toBeInTheDocument();
  });
});
