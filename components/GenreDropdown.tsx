import React from 'react';
import styled from '@emotion/styled';

type GenreDropdownProps = {
  genres: string[];
  selectedGenre: string;
  onChange: (genre: string) => void;
};

const GenreDropdown: React.FC<GenreDropdownProps> = ({ genres, selectedGenre, onChange }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor="genre-select" style={{ marginRight: '0.5rem' }}>
        Filter by genre:
      </label>
      <StyledSelect
        id="genre-select"
        value={selectedGenre}
        onChange={(e) => onChange(e.target.value)}>
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </StyledSelect>
    </div>
  );
};

const StyledSelect = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  min-width: 200px;
`;

export default GenreDropdown;
