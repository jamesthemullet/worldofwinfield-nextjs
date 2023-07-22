import React, { useState } from 'react';
import { searchBlogPosts } from '../lib/api';
import { colours } from '../pages/_app';
import styled from '@emotion/styled';
import { SearchBarProps } from '../lib/types';

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const searchResults = await searchBlogPosts(query);
    setLoading(false);
    onSearch(searchResults);
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <input type="text" placeholder="Search blog..." value={query} onChange={handleChange} />
      <button type="submit">{loading ? 'Searching...' : 'Search'}</button>
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

  input {
    margin-bottom: 10px;
    padding: 10px;
    border: none;
    width: 200px;
  }

  button {
    padding: 10px;
    border: none;
    width: 100px;
    background-color: ${colours.pink};
    color: ${colours.white};
    font-weight: bold;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    margin: 0;
  }
`;
