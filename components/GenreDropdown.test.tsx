import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GenreDropdown from './GenreDropdown';

const genres = ['Rock', 'Pop', 'Jazz', 'Classical'];

describe('GenreDropdown', () => {
  it('renders the "Filter by genre:" label', () => {
    render(<GenreDropdown genres={genres} selectedGenre="" onChange={jest.fn()} />);
    expect(screen.getByText('Filter by genre:')).toBeInTheDocument();
  });

  it('renders the "All Genres" default option', () => {
    render(<GenreDropdown genres={genres} selectedGenre="" onChange={jest.fn()} />);
    expect(screen.getByRole('option', { name: 'All Genres' })).toBeInTheDocument();
  });

  it('renders all provided genre options', () => {
    render(<GenreDropdown genres={genres} selectedGenre="" onChange={jest.fn()} />);
    genres.forEach((genre) => {
      expect(screen.getByRole('option', { name: genre })).toBeInTheDocument();
    });
  });

  it('reflects the selected genre via the select value', () => {
    render(<GenreDropdown genres={genres} selectedGenre="Rock" onChange={jest.fn()} />);
    expect(screen.getByRole('combobox')).toHaveValue('Rock');
  });

  it('calls onChange with the chosen genre when the selection changes', () => {
    const handleChange = jest.fn();
    render(<GenreDropdown genres={genres} selectedGenre="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Jazz' } });
    expect(handleChange).toHaveBeenCalledWith('Jazz');
  });

  it('calls onChange with an empty string when "All Genres" is selected', () => {
    const handleChange = jest.fn();
    render(<GenreDropdown genres={genres} selectedGenre="Rock" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('renders correctly with an empty genres list', () => {
    render(<GenreDropdown genres={[]} selectedGenre="" onChange={jest.fn()} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All Genres' })).toBeInTheDocument();
  });
});
