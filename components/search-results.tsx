import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { sanitize } from '../lib/sanitize';
import type { SearchResultsProps } from '../lib/types';
import { colours } from '../pages/_app';

const blockColours = [
  colours.pink,
  colours.green,
  colours.purple,
  colours.burgandy,
  colours.dark,
  colours.azure,
  colours.blueish,
];

const getColourFromTitle = (title: string): string => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) & 0xffffffff;
  }
  return blockColours[Math.abs(hash) % blockColours.length];
};

const stripReadMoreParagraph = (excerpt: string): string => {
  return excerpt.replace(/\s*<a\b[^>]*>.*?<\/a>/gi, '').trim();
};

const SearchResults = ({ searchResults }: SearchResultsProps): JSX.Element => {
  return (
    <SearchResultsContainer>
      {searchResults !== null && searchResults.length === 0 && (
        <p className="center">No results found.</p>
      )}
      {(searchResults?.length ?? 0) > 0 && (
        <>
          <ResultCount>
            {searchResults!.length} result{searchResults!.length !== 1 ? 's' : ''}
          </ResultCount>
          {searchResults!.map((post) => (
            <SearchCard key={post.slug}>
              {post.featuredImage?.node.sourceUrl && (
                <SearchCardImageWrapper>
                  <Link href={`/${post.slug}`} aria-label={post.title}>
                    <Image
                      alt=""
                      src={post.featuredImage.node.sourceUrl}
                      sizes="(max-width: 768px) 100vw, 240px"
                      quality={75}
                      fill
                    />
                  </Link>
                </SearchCardImageWrapper>
              )}
              <SearchCardContent>
                <SearchCardTitle>
                  <Link href={`/${post.slug}`}>{post.title}</Link>
                </SearchCardTitle>
                <SearchCardDate>{formatDate(post.date)}</SearchCardDate>
                {post.excerpt && (
                  <SearchCardExcerpt
                    dangerouslySetInnerHTML={{
                      __html: sanitize(stripReadMoreParagraph(post.excerpt)),
                    }}
                  />
                )}
                <ContinueReadingLink
                  href={`/${post.slug}`}
                  colour={getColourFromTitle(post.title)}
                  aria-label={`Continue reading about ${post.title}`}>
                  Continue reading
                </ContinueReadingLink>
              </SearchCardContent>
            </SearchCard>
          ))}
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
  padding: 0 1rem;
  margin: 0 auto 10px;
  max-width: 900px;
  color: ${colours.dark};

  @media (min-width: 768px) {
    padding: 0;
  }

  p.center {
    text-align: center;
  }
`;

const ResultCount = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SearchCardImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;

  a {
    display: block;
    width: 100%;
    height: 100%;
  }

  @media (min-width: 768px) {
    width: 240px;
    height: 160px;
  }
`;

const SearchCard = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1.5rem;
    align-items: flex-start;
  }
`;

const SearchCardContent = styled.div`
  flex: 1;
`;

const SearchCardTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0.75rem 0 0.25rem;

  @media (min-width: 768px) {
    margin-top: 0;
  }

  a {
    text-decoration: none;
    color: inherit;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SearchCardDate = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const SearchCardExcerpt = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 0.75rem;

  p {
    margin: 0;
  }
`;

const ContinueReadingLink = styled(Link)<{ colour: string }>`
  display: inline-block;
  padding: 10px;
  font-size: 1rem;
  min-width: 100px;
  background-color: ${(props) => props.colour};
  color: ${colours.white};
  font-weight: bold;
  text-decoration: none;
  text-align: center;

  &:hover {
    opacity: 0.85;
  }
`;
