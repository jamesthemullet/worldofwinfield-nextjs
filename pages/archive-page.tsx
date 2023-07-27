import React from 'react';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { getPostsByDate } from '../lib/api';
import { ArchivePageProps } from '../lib/types';
import Container from '../components/container';
import Layout from '../components/layout';
import PostTitle from '../components/post-title';
import PostHeader from '../components/post-header';
import Head from 'next/head';
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
            <Head>
              <title>{`Archive Posts from ${wordyMonth} ${year}`}</title>
              <meta property="og:image" content={posts[0].featuredImage?.node.sourceUrl} />
            </Head>
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
                    <a href={`/posts/${post.slug}`}>{post.title}</a>
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

export async function getServerSideProps(context) {
  const { month, year } = context.query;
  const posts = await getPostsByDate(parseInt(month), parseInt(year));
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
