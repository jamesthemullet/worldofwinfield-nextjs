import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import Container from '../components/container';
import PostHeader from '../components/post-header';
import Layout from '../components/layout';
import PostTitle from '../components/post-title';
import { filterPostsByTag } from '../lib/api';
import { PostsProps } from '../lib/types';
import styled from '@emotion/styled';
import { useState } from 'react';
import FavouriteResults from './favourites-results';
import { StyledButton } from '../components/core-components';

export default function FavouritesPage({ posts }: PostsProps) {
  const [selectedType, setSelectedType] = useState(null);

  const handleTypeClick = (type) => {
    setSelectedType(type);
  };

  const router = useRouter();

  if (!router.isFallback && !posts?.length) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout preview={null} seo={posts[0]?.seo}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <PostContainer>
              <Head>
                <title>Favourite...</title>
                {/* <meta property="og:image" content={post.featuredImage?.node.sourceUrl} /> */}
              </Head>
              <StyledPostHeader>
                <PostHeader
                  title="Favourite..."
                  // coverImage={post?.featuredImage}
                  // date={post.date}
                  // author="James Winfield"
                  // categories={post.categories}
                />
              </StyledPostHeader>
              <RowOfButtons>
                <StyledButton onClick={() => handleTypeClick('favouriteMoviesSheetID')}>
                  Favorite Movies
                </StyledButton>
                <StyledButton onClick={() => handleTypeClick('favouriteBooksSheetID')}>
                  Favorite Books
                </StyledButton>
                <StyledButton onClick={() => handleTypeClick('TestID')}>
                  Test Favorites
                </StyledButton>
              </RowOfButtons>
              {selectedType && <FavouriteResults type={selectedType} />}
            </PostContainer>
          </>
        )}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const goalsPosts = await filterPostsByTag('goals');

  return {
    props: {
      posts: goalsPosts,
    },
    revalidate: 10,
  };
};

const PostContainer = styled.article`
  h1 {
    font-size: 3rem;
    padding: 1rem;
    line-height: 4rem;
  }
`;

const StyledPostHeader = styled.div`
  margin: 0 auto;
`;

const RowOfButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-top: 2rem;
`;
