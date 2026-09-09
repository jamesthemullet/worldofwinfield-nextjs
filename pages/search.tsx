import styled from '@emotion/styled';
import type { GetServerSideProps } from 'next';
import type { JSX } from 'react';
import Container from '../components/container';
import Layout from '../components/layout';
import SearchBar from '../components/search-bar';
import SearchResults from '../components/search-results';
import { performGlobalSearch } from '../lib/global-search';
import type { GlobalSearchResults } from '../lib/types';

type SearchPageProps = {
  query: string;
  searchResults: GlobalSearchResults;
};

export default function SearchPage({ query, searchResults }: SearchPageProps): JSX.Element {
  const seo = {
    opengraphTitle: `Search: "${query}" — World Of Winfield`,
    opengraphDescription: `Search results for "${query}" across blog posts, books, movies, restaurants, and more.`,
    opengraphSiteName: 'World Of Winfield',
  };

  return (
    <Layout preview={false} seo={seo} ogType="website" noindex>
      <Container>
        <Heading>Search results for &ldquo;{query}&rdquo;</Heading>
        <SearchBar<GlobalSearchResults>
          navigateTo="/search"
          initialQuery={query}
          label="Search everything"
          placeholder="Search blog, favourites, wish lists..."
        />
        <SearchResults searchResults={searchResults} />
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async (context) => {
  const rawQ = context.query.q;
  const query = (Array.isArray(rawQ) ? rawQ[0] : rawQ) ?? '';

  const searchResults = query
    ? await performGlobalSearch(query)
    : ({ posts: [] } satisfies GlobalSearchResults);

  return {
    // JSON round-trip strips `undefined` values (e.g. missing subtitles),
    // which getServerSideProps otherwise rejects as non-serializable.
    props: { query, searchResults: JSON.parse(JSON.stringify(searchResults)) },
  };
};

const Heading = styled.h1`
  text-align: center;
  padding: 1.5rem 1rem 0;
`;
