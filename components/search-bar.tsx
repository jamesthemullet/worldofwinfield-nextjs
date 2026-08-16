import styled from '@emotion/styled';
import React, { type JSX, useState } from 'react';
import type { SearchBarProps, SearchResult } from '../lib/types';
import { colours } from '../pages/_app';
import { StyledButton, StyledInput } from './core-components';

const SearchBar = <T = SearchResult[]>({
  onSearch,
  endpoint = '/api/search',
  label = 'Search blog',
  placeholder = 'Search blog...',
}: SearchBarProps<T>): JSX.Element => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const inputId = `search-input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${endpoint}?q=${encodeURIComponent(query)}`);
    const searchResults = (await res.json()) as T;
    setLoading(false);
    onSearch(searchResults);
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <label htmlFor={inputId}>{label}</label>
      <StyledInput
        id={inputId}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
      <StyledButton type="submit">{loading ? 'Searching...' : 'Search'}</StyledButton>
    </StyledForm>
  );
};

export default SearchBar;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${colours.dark};
  color: ${colours.white};
  margin: 0 10px 10px;
  padding: 20px;

  @media (max-width: 768px) {
    margin: 0;
  }
`;
