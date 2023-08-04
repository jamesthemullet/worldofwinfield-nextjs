import { GetStaticProps } from 'next';
import { useState } from 'react';
import Intro from '../components/intro';
import Layout from '../components/layout';
import { getJamesImages } from '../lib/api';
import { IndexPageProps } from '../lib/types';
import HomepageBlock from '../components/homepage-block';
import styled from '@emotion/styled';
import SearchBar from '../components/search-bar';
import SearchResults from '../components/search-results';

import { nanoid } from 'nanoid';

export default function Index({ preview, jamesImages }: IndexPageProps) {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (results) => {
    setSearchResults(results);
  };
  const tempBlocks = [
    'all the blog',
    'travel',
    'goals',
    'politics',
    'music',
    'favourites',
    'want to do',
  ];
  const blocks = tempBlocks.length % 2 === 0 ? tempBlocks : [...tempBlocks, '?'];

  return (
    <Layout preview={preview} seo={null}>
      <Intro jamesImages={jamesImages} />
      <HomepageBlocksContainer>
        {blocks.map((block) => (
          <HomepageBlock key={nanoid()} props={block} />
        ))}
      </HomepageBlocksContainer>
      <SearchBar onSearch={handleSearch} />
      <SearchResults searchResults={searchResults} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const jamesImages = await getJamesImages({ first: 20 });

  return {
    props: { preview, jamesImages },
    revalidate: 10,
  };
};

const HomepageBlocksContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  padding: 0 10px 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0;
    gap: 0;
  }
`;
