import { GetStaticProps } from 'next';
import { useState } from 'react';
import Intro from '../components/intro';
import Layout from '../components/layout';
import { getFirstPost, getJamesImages } from '../lib/api';
import { IndexPageProps } from '../lib/types';
import HomepageBlock from '../components/homepage-block';
import styled from '@emotion/styled';
import SearchBar from '../components/search-bar';
import SearchResults from '../components/search-results';

import { nanoid } from 'nanoid';

export default function Index({ preview, jamesImages, firstPost }: IndexPageProps) {
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const blocks = [
    {
      className: 'block-1',
      title: 'all the blog',
      url: '/blog',
      size: 3,
    },
    {
      className: 'block-1-1 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-1-2 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-1-3 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    { className: 'block-2', title: 'travel', url: '/travel', size: 2 },
    { className: 'block-2-1 placeholder', title: 'placeholder', url: '/food', size: 1 },
    { className: 'block-2-2 placeholder', title: 'placeholder', url: '/food', size: 1 },
    { className: 'block-2-3 placeholder', title: 'placeholder', url: '/food', size: 1 },
    { className: 'block-5', title: 'goals', url: '/goals', size: 2 },
    {
      className: 'block-5-1 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    { className: 'block-5-2 placeholder', title: 'placeholder', url: '/food', size: 1 },
    { className: 'block-5-9 placeholder', title: 'placeholder', url: '/food', size: 2 },
    {
      className: 'block-6',
      title: `${firstPost.edges[0].node.title}`,
      url: `posts/${firstPost.edges[0].node.slug}`,
      size: 3,
      image: firstPost.edges[0].node.featuredImage,
      date: firstPost.edges[0].node.date,
    },
    {
      className: 'block-6-1 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-6-2 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-6-3 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    { className: 'block-7', title: 'music', url: '/music', size: 2 },
    {
      className: 'block-7-1 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-7-2 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-7-3 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-7-9 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 2,
    },
    {
      className: 'block-8',
      title: 'favourites',
      url: '/favourites',
      size: 3,
    },
    {
      className: 'block-8-1 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-8-2 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-8-3 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-8-4 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-9',
      title: 'want to do',
      url: '/wants',
      size: 3,
    },
    {
      className: 'block-9-1 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-9-2 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-10',
      title: 'politics',
      url: '/politics',
      size: 2,
    },
    {
      className: 'block-10-1 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-10-2 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-10-3 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 2,
    },
    {
      className: 'block-11',
      title: 'random blog post',
      url: '/',
      size: 3,
    },
    {
      className: 'block-11-1 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-11-2 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-11-3 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-12',
      title: 'random blog post',
      url: '/',
      size: 2,
    },
    {
      className: 'block-12-1 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-13',
      title: 'random blog post',
      url: '/',
      size: 2,
    },
    {
      className: 'block-13-1 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-13-2 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-13-3 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-13-9 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 2,
    },
    { className: 'block-14', title: 'random photo', url: '/', size: 2 },
    {
      className: 'block-14-1 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-14-2 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-14-3 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },

    {
      className: 'block-14-4 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },

    {
      className: 'block-14-5 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 1,
    },
    {
      className: 'block-14-9 placeholder',
      title: 'placeholder',
      url: '/music',
      size: 2,
    },
  ];

  return (
    <Layout preview={preview} seo={null}>
      <Intro jamesImages={jamesImages} />
      <HomepageBlocksContainer>
        {blocks.map((block) => (
          <HomepageBlock
            className={block.className}
            key={nanoid()}
            title={block.title}
            url={block.url}
            size={block.size}
            image={block.image}
            date={block.date}
            jamesImages={jamesImages}
          />
        ))}
      </HomepageBlocksContainer>
      <SearchBar onSearch={handleSearch} />
      <SearchResults searchResults={searchResults} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const jamesImages = await getJamesImages({ first: 20 });
  const firstPost = await getFirstPost();

  return {
    props: { preview, jamesImages, firstPost },
    revalidate: 10,
  };
};

const HomepageBlocksContainer = styled.div`
  @media (min-width: 769px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    padding: 0 10px 10px;
  }

  @media (min-width: 2110px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }

  @media (min-width: 2310px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  @media (min-width: 2510px) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }

  @media (min-width: 2710px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  @media (min-width: 2910px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  @media (min-width: 3110px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  @media (min-width: 3310px) {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }

  @media (min-width: 3510px) {
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  }
`;
