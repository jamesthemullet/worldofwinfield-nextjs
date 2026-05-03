import React from 'react';
import { colours } from '../pages/_app';
import styled from '@emotion/styled';
import { SearchResultsProps } from '../lib/types';

const SearchResults = ({ searchResults, searchTerm }: SearchResultsProps) => {
  return (
    <SearchResultsContainer>
      {searchResults !== null && searchResults.length === 0 && <p className="center">No results found.</p>}
      {(searchResults?.length ?? 0) > 0 && (
        <>
          <p>Search results:</p>
          <ul>
            {searchResults?.map((post) => (
              <li key={post.slug}>
                <a href={`/${post.slug}`}>{post.title}</a>
                <p className="date">{formatDate(post.date)}</p>
                {post.content && searchTerm && (
                  <p className="snippet">{highlightTerm(getSnippet(post.content, searchTerm), searchTerm)}</p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </SearchResultsContainer>
  );
};

export default SearchResults;

export const getSnippet = (content: string, term: string, contextLength = 150): string => {
  const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!term) return text.slice(0, contextLength);
  const lowerText = text.toLowerCase();
  const lowerTerm = term.toLowerCase();
  const index = lowerText.indexOf(lowerTerm);
  if (index === -1) return text.slice(0, contextLength);
  const start = Math.max(0, index - Math.floor(contextLength / 2));
  const end = Math.min(text.length, start + contextLength);
  return text.slice(start, end);
};

export const highlightTerm = (snippet: string, term: string): React.ReactNode => {
  if (!term) return snippet;
  const lowerSnippet = snippet.toLowerCase();
  const lowerTerm = term.toLowerCase();
  const index = lowerSnippet.indexOf(lowerTerm);
  if (index === -1) return snippet;
  return (
    <>
      {snippet.slice(0, index)}
      <mark>{snippet.slice(index, index + term.length)}</mark>
      {snippet.slice(index + term.length)}
    </>
  );
};

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

  p.date {
    margin: 2px 0;
    font-size: 0.85em;
  }

  p.snippet {
    margin: 4px 0 0;
    font-size: 0.9em;

    mark {
      background-color: rgba(136, 132, 255, 0.3);
      color: inherit;
    }
  }
`;
