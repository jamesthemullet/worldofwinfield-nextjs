import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import React from 'react';
import Container from '../components/container';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import PostTitle from '../components/post-title';
import { getMonthName } from '../components/utils';
import { getPostsByDate } from '../lib/api';
import { ArchivePageProps } from '../lib/types';
import { colours } from './_app';

const ArchivePage = ({ posts: { posts }, month, year }: ArchivePageProps) => {
  const router = useRouter();
  const wordyMonth = getMonthName(month);
  const title = `Archives Posts from ${wordyMonth} ${year}`;
  const hasPosts = posts.length > 0 && posts[0]?.slug;

  if (router.isFallback) {
    return <PostTitle>Loading…</PostTitle>;
  }

  return (
    <Layout preview={null} seo={hasPosts ? posts[0]?.seo : null}>
      <Container>
        <PostHeader
          title={title}
          coverImage={hasPosts ? posts[0].featuredImage : undefined}
          date={hasPosts ? posts[0].date : undefined}
        />
        {hasPosts ? (
          <SearchResultsContainer>
            <ul>
              {posts.map((post) => (
                <li key={post.id}>
                  <a href={`/${post.slug}`}>{post.title}</a>
                </li>
              ))}
            </ul>
          </SearchResultsContainer>
        ) : (
          <NoPostsMessage>
            No posts found for {wordyMonth} {year}
          </NoPostsMessage>
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

const NoPostsMessage = styled.p`
  color: ${colours.dark};
  font-size: 1.25rem;
  padding: 2rem;
  text-align: center;
`;

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
