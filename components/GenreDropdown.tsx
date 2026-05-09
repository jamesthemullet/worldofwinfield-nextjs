import styled from '@emotion/styled';
import React from 'react';

type GenreDropdownProps = {
  genres: string[];
  selectedGenre: string;
  onChange: (genre: string) => void;
  filterLabel?: string;
  allOptionText?: string;
  selectId?: string;
};

const GenreDropdown: React.FC<GenreDropdownProps> = ({
  genres,
  selectedGenre,
  onChange,
  filterLabel = 'Filter by genre:',
  allOptionText = 'All Genres',
  selectId = 'genre-select',
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={selectId} style={{ marginRight: '0.5rem' }}>
        {filterLabel}
      </label>
      <StyledSelect id={selectId} value={selectedGenre} onChange={(e) => onChange(e.target.value)}>
        {allOptionText && <option value="">{allOptionText}</option>}
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
