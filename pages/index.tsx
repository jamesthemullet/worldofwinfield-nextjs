import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import Intro from '../components/intro';
import Layout from '../components/layout';
import { getFirstPost, getJamesImages, getPostDisplayInfo, getRandomImage } from '../lib/api';
import { IndexPageProps } from '../lib/types';
import HomepageBlock from '../components/homepage-block';
import styled from '@emotion/styled';
import SearchBar from '../components/search-bar';
import SearchResults from '../components/search-results';
import { hardCodedListOfPostIds } from '../data/allIds';

import { nanoid } from 'nanoid';

export default function Index({
  preview,
  jamesImages,
  firstPost,
  randomPosts,
  randomImageSet,
}: IndexPageProps) {
  const [searchResults, setSearchResults] = useState(null);
  const [randomImage, setRandomImage] = useState(null);

  useEffect(() => {
    if (!randomImageSet.images?.length) {
      setRandomImage(jamesImages.edges[0].node.featuredImage);
    } else {
      const randomIndex = Math.floor(Math.random() * randomImageSet.images?.length);
      setRandomImage(randomImageSet.images[randomIndex]);
    }
  }, [randomImageSet]);

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const blocks = [
    {
      className: 'block-1',
      title: 'all the blog',
      url: '/blog',
      size: 3,
      icon: '003-desktop-computer',
    },
    {
      className: 'block-1-1 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-1-2 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-1-3 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    { className: 'block-2', title: 'travel', url: '/travel', size: 2, icon: '006-travel' },
    { className: 'block-2-1 placeholder', title: 'placeholder', url: null, size: 1 },
    { className: 'block-2-2 placeholder', title: 'placeholder', url: null, size: 1 },
    { className: 'block-2-3 placeholder', title: 'placeholder', url: null, size: 1 },
    { className: 'block-5', title: 'goals', url: '/goals', size: 2, icon: '010-stairs' },
    {
      className: 'block-5-1 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    { className: 'block-5-2 placeholder', title: 'placeholder', url: null, size: 1 },
    { className: 'block-5-9 placeholder', title: 'placeholder', url: null, size: 2 },
    {
      className: 'block-6',
      title: `${firstPost.edges[0].node.title}`,
      url: `${firstPost.edges[0].node.slug}`,
      size: 3,
      image: firstPost.edges[0].node.featuredImage,
      date: firstPost.edges[0].node.date,
    },
    {
      className: 'block-6-1 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-6-2 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-6-3 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    { className: 'block-7', title: 'music', url: '/music', size: 2, icon: '004-record' },
    {
      className: 'block-7-1 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-7-2 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-7-3 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-7-9 placeholder',
      title: 'placeholder',
      url: null,
      size: 2,
    },
    {
      className: 'block-8',
      title: 'favourites',
      url: '/favourites',
      size: 3,
      icon: '007-star',
    },
    {
      className: 'block-8-1 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-8-2 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-8-3 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-8-4 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-9',
      title: 'want to do',
      url: '/wants',
      size: 3,
      icon: '002-wish-list',
    },
    {
      className: 'block-9-1 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-9-2 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-10',
      title: 'politics',
      url: '/politics',
      size: 2,
      icon: '005-vote',
    },
    {
      className: 'block-10-1 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-10-2 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-10-3 placeholder',
      title: 'placeholder',
      url: null,
      size: 2,
    },
    {
      className: 'block-11',
      title: randomPosts[0]?.title,
      url: `/${randomPosts[0]?.slug}`,
      size: 3,
      image: randomPosts[0]?.featuredImage,
      date: randomPosts[0]?.date,
    },
    {
      className: 'block-11-1 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-11-2 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-11-3 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-12',
      title: randomPosts[1]?.title,
      url: `/${randomPosts[1]?.slug}`,
      size: 2,
      image: randomPosts[1]?.featuredImage,
      date: randomPosts[1]?.date,
    },
    {
      className: 'block-12-1 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-13',
      title: randomPosts[2]?.title,
      url: `/${randomPosts[2]?.slug}`,
      size: 2,
      image: randomPosts[2]?.featuredImage,
      date: randomPosts[2]?.date,
    },
    {
      className: 'block-13-1 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-13-2 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-13-3 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-13-9 placeholder',
      title: 'placeholder',
      url: null,
      size: 2,
    },
    {
      className: 'block-14',
      title: 'random photo',
      url: '/',
      size: 2,
      image: randomImage,
    },
    {
      className: 'block-14-1 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-14-2 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-14-3 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-14-4 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-14-5 placeholder',
      title: 'placeholder',
      url: null,
      size: 1,
    },
    {
      className: 'block-14-9 placeholder',
      title: 'placeholder',
      url: null,
      size: 2,
    },
  ];

  const seo = {
    opengraphImage: firstPost.edges[0].node.seo.opengraphImage,
    opengraphTitle: `Home - World Of Winfield`,
    opengraphDescription: `Home - World Of Winfield`,
    opengraphSiteName: `World Of Winfield`,
  };

  return (
    <Layout preview={preview} seo={seo}>
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
            icon={block.icon}
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

  const getRandomPostId = () =>
    hardCodedListOfPostIds[Math.floor(Math.random() * hardCodedListOfPostIds.length)];
  const randomPosts = await getPostDisplayInfo([
    getRandomPostId(),
    getRandomPostId(),
    getRandomPostId(),
  ]);

  const years = Array.from(new Array(new Date().getFullYear() - 2017), (x, i) => i + 2018);
  const randomYear = years[Math.floor(Math.random() * years.length)];
  const randomMonth = Math.floor(Math.random() * 12) + 1;
  const randomImageSet = await getRandomImage(randomMonth, randomYear);

  return {
    props: { preview, jamesImages, firstPost, randomPosts, randomImageSet },
    revalidate: 10,
  };
};

const HomepageBlocksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (min-width: 769px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 8px;
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
