import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import FavouriteCoverGrid from '../components/FavouriteCoverGrid';

const headerRow = ['Author', 'Title', 'Score'];
const rows = [
  ['Frank Herbert', 'Dune', '9'],
  ['William Gibson', 'Neuromancer', '8'],
];

describe('FavouriteCoverGrid', () => {
  it('renders a cover image when a cover URL is available', () => {
    render(
      <FavouriteCoverGrid
        headerRow={headerRow}
        rows={rows}
        coverArtByTitle={{ Dune: 'https://covers.openlibrary.org/b/id/1-M.jpg', Neuromancer: null }}
        indexRequired
      />,
    );

    const img = screen.getByAltText('Cover of Dune');
    expect(img).toHaveAttribute('src', 'https://covers.openlibrary.org/b/id/1-M.jpg');
  });

  it('renders a placeholder with initials when no cover URL is available', () => {
    render(
      <FavouriteCoverGrid
        headerRow={headerRow}
        rows={rows}
        coverArtByTitle={{ Dune: 'https://covers.openlibrary.org/b/id/1-M.jpg', Neuromancer: null }}
        indexRequired
      />,
    );

    expect(screen.queryByAltText('Cover of Neuromancer')).not.toBeInTheDocument();
    expect(screen.getByText('N')).toBeInTheDocument();
  });

  it('renders rank badges when indexRequired is true', () => {
    render(
      <FavouriteCoverGrid headerRow={headerRow} rows={rows} coverArtByTitle={{}} indexRequired />,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('omits rank badges when indexRequired is false', () => {
    render(
      <FavouriteCoverGrid
        headerRow={headerRow}
        rows={rows}
        coverArtByTitle={{}}
        indexRequired={false}
      />,
    );

    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('renders title, author, and score for each card', () => {
    render(
      <FavouriteCoverGrid headerRow={headerRow} rows={rows} coverArtByTitle={{}} indexRequired />,
    );

    expect(screen.getByText('Dune')).toBeInTheDocument();
    expect(screen.getByText('Frank Herbert')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });
});
