import styled from '@emotion/styled';
import type { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Container from '../components/container';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import PostTitle from '../components/post-title';
import { getMonthName } from '../components/utils';
import { getPostsByDate } from '../lib/api';
import type { ArchivePageProps } from '../lib/types';
import { colours } from './_app';

const getPrevMonth = (month: number, year: number) =>
  month === 1 ? { month: 12, year: year - 1 } : { month: month - 1, year };

const getNextMonth = (month: number, year: number) =>
  month === 12 ? { month: 1, year: year + 1 } : { month: month + 1, year };

const isFuture = (month: number, year: number) => {
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth() + 1);
};

const MonthNavBar = ({ month, year }: { month: number; year: number }) => {
  const prev = getPrevMonth(month, year);
  const next = getNextMonth(month, year);
  const nextIsFuture = isFuture(next.month, next.year);

  return (
    <MonthNav aria-label="Archive navigation">
      <Link
        href={{ pathname: '/archive-page', query: prev }}
        aria-label={`Previous month: ${getMonthName(prev.month)} ${prev.year}`}>
        ← {getMonthName(prev.month)} {prev.year}
      </Link>
      {!nextIsFuture && (
        <Link
          href={{ pathname: '/archive-page', query: next }}
          aria-label={`Next month: ${getMonthName(next.month)} ${next.year}`}>
          {getMonthName(next.month)} {next.year} →
        </Link>
      )}
    </MonthNav>
  );
};

const ArchivePage = ({ posts: { posts }, month, year }: ArchivePageProps) => {
  const router = useRouter();
  const wordyMonth = getMonthName(month);
  const title = `Archives Posts from ${wordyMonth} ${year}`;
  const hasPosts = posts.length > 0 && posts[0]?.slug;

  if (router.isFallback) {
    return <PostTitle>Loading…</PostTitle>;
  }

  const archiveSeo = {
    opengraphTitle: `Posts from ${wordyMonth} ${year} | World Of Winfield`,
    opengraphDescription: `Browse all blog posts from ${wordyMonth} ${year} on World Of Winfield.`,
    opengraphSiteName: 'World Of Winfield',
  };

  return (
    <Layout
      preview={null}
      seo={archiveSeo}
      title={`Posts from ${wordyMonth} ${year} | World Of Winfield`}
      ogType="website">
      <Container>
        <PostHeader
          title={title}
          coverImage={hasPosts ? posts[0].featuredImage : undefined}
          date={hasPosts ? posts[0].date : undefined}
        />
        <MonthNavBar month={month} year={year} />
        {hasPosts ? (
          <SearchResultsContainer>
            <ul>
              {posts.map((post) => (
                <li key={post.id}>
                  <Link href={`/${post.slug}`}>{post.title}</Link>
                </li>
              ))}
            </ul>
          </SearchResultsContainer>
        ) : (
          <NoPostsMessage>
            No posts found for {wordyMonth} {year}
          </NoPostsMessage>
        )}
        <MonthNavBar month={month} year={year} />
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const month = parseInt(
    Array.isArray(query.month) ? (query.month[0] ?? '') : (query.month ?? ''),
    10,
  );
  const year = parseInt(Array.isArray(query.year) ? (query.year[0] ?? '') : (query.year ?? ''), 10);

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

const MonthNav = styled.nav`
  display: flex;
  justify-content: space-between;
  padding: 1rem 20px;
  max-width: 400px;
  margin: 0 auto;

  a {
    color: ${colours.dark};
    font-weight: bold;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

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
