import styled from '@emotion/styled';
import React from 'react';
import { SearchResultsProps } from '../lib/types';
import { colours } from '../pages/_app';

const SearchResults = ({ searchResults }: SearchResultsProps) => {
  return (
    <SearchResultsContainer>
      {searchResults !== null && searchResults.length === 0 && (
        <p className="center">No results found.</p>
      )}
      {(searchResults?.length ?? 0) > 0 && (
        <>
          <p>Search results:</p>
          <ul>
            {searchResults?.map((post) => (
              <li key={post.slug}>
                <p>
                  <a href={`/${post.slug}`}>{post.title}</a> - {formatDate(post.date)}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </SearchResultsContainer>
  );
};

export default SearchResults;

export const formatDate = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const formattedDate = new Date(date).toLocaleString(undefined, options);

  const day = new Date(date).getDate();
  const dayWithOrdinal = addOrdinalIndicator(day);

  return formattedDate.replace(day.toString(), dayWithOrdinal);
};

const addOrdinalIndicator = (day: number): string => {
  if (day >= 11 && day <= 13) {
    return day + 'th';
  } else {
    const lastDigit = day % 10;
    switch (lastDigit) {
      case 1:
        return day + 'st';
      case 2:
        return day + 'nd';
      case 3:
        return day + 'rd';
      default:
        return day + 'th';
    }
  }
};

const SearchResultsContainer = styled.div`
  list-style: none;
  padding: 0;
  margin: 0;
  color: ${colours.dark};
  margin: 0 auto 10px;
  max-width: 400px;

  li {
    margin-bottom: 10px;
  }

  a {
    color: ${colours.dark};
  }

  p.center {
    text-align: center;
  }
`;
