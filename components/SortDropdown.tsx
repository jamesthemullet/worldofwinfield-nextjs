import React from 'react';
import styled from '@emotion/styled';

type SortDropdownProps = {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
};

const SortDropdown: React.FC<SortDropdownProps> = ({ options, selected, onChange }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor="sort-select" style={{ marginRight: '0.5rem' }}>
        Sort by:
      </label>
      <Select id="sort-select" value={selected} onChange={(e) => onChange(e.target.value)}>
        <option value="">Default</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </Select>
    </div>
  );
};

const Select = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  min-width: 200px;
`;

export default SortDropdown;
