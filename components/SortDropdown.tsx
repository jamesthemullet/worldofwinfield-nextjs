import styled from '@emotion/styled';
import type { JSX } from 'react';

type SortDropdownProps = {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
};

function SortDropdown({ options, selected, onChange }: SortDropdownProps): JSX.Element {
  return (
    <Wrapper>
      <Label htmlFor="sort-select">Sort by:</Label>
      <Select id="sort-select" value={selected} onChange={(e) => onChange(e.target.value)}>
        <option value="">Default</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </Select>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin: 1rem 0;
  text-align: center;
`;

const Label = styled.label`
  margin-right: 0.5rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  min-width: 200px;
`;

export default SortDropdown;
