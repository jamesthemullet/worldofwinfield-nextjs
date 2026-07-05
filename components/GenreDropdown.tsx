import styled from '@emotion/styled';

type GenreDropdownProps = {
  genres: string[];
  selectedGenre: string;
  onChange: (genre: string) => void;
  filterLabel?: string;
  allOptionText?: string;
  selectId?: string;
};

function GenreDropdown({
  genres,
  selectedGenre,
  onChange,
  filterLabel = 'Filter by genre:',
  allOptionText = 'All Genres',
  selectId = 'genre-select',
}: GenreDropdownProps) {
  return (
    <Wrapper>
      <Label htmlFor={selectId}>{filterLabel}</Label>
      <StyledSelect id={selectId} value={selectedGenre} onChange={(e) => onChange(e.target.value)}>
        {allOptionText && <option value="">{allOptionText}</option>}
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </StyledSelect>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  margin-right: 0.5rem;
`;

const StyledSelect = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  min-width: 200px;
`;

export default GenreDropdown;
