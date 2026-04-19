import React from 'react';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { getPostsByDate } from '../lib/api';
import { ArchivePageProps } from '../lib/types';
import Container from '../components/container';
import Layout from '../components/layout';
import PostTitle from '../components/post-title';
import PostHeader from '../components/post-header';
import { getMonthName } from '../components/utils';
import { colours } from './_app';
import styled from '@emotion/styled';

const ArchivePage = ({ posts: { posts }, month, year }: ArchivePageProps) => {
  const router = useRouter();
  const wordyMonth = getMonthName(month);

  if (!router.isFallback && !posts[0]?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout preview={null} seo={posts[0]?.seo}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <PostHeader
              title={`Archives Posts from ${wordyMonth} ${year}`}
              coverImage={posts[0].featuredImage}
              date={posts[0].date}
              author={posts[0].author}
              categories={posts[0].categories}
            />
            <SearchResultsContainer>
              <ul>
                {posts.map((post) => (
                  <li key={post.id}>
                    <a href={`/${post.slug}`}>{post.title}</a>
                  </li>
                ))}
              </ul>
            </SearchResultsContainer>
          </>
        )}
      </Container>
    </Layout>
  );
};

export async function getServerSideProps(context: { query: { month: string; year: string } }) {
  const month = parseInt(context.query.month, 10);
  const year = parseInt(context.query.year, 10);

  if (isNaN(month) || month < 1 || month > 12) {
    return { notFound: true };
  }
  if (isNaN(year) || year < 2000 || year > new Date().getFullYear()) {
    return { notFound: true };
  }

  const posts = await getPostsByDate(month, year);
  return {
    props: { posts, month, year },
  };
}

export default ArchivePage;

const SearchResultsContainer = styled.div`
  list-style: none;
  padding: 0;
  margin: 0;
  color: ${colours.dark};
  margin: 0 auto 10px;
  padding: 20px;
  max-width: 400px;

  li {
    margin-bottom: 10px;
  }

  a {
    color: ${colours.dark};
  }
`;
