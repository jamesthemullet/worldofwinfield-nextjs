import styled from '@emotion/styled';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import Container from '../components/container';
import HeroPost from '../components/hero-post';
import Layout from '../components/layout';
import MoreStories from '../components/more-stories';
import SearchBar from '../components/search-bar';
import SearchResults from '../components/search-results';
import { getAllPostsForHome } from '../lib/api';
import type { GlobalSearchResults, IndexPageProps } from '../lib/types';

export default function Index({ allPosts, preview }: IndexPageProps) {
  const [searchResults, setSearchResults] = useState<GlobalSearchResults | null>(null);
  const [posts, setPosts] = useState(allPosts.edges);
  const [hasNextPage, setHasNextPage] = useState(allPosts.pageInfo.hasNextPage);
  const [endCursor, setEndCursor] = useState(allPosts.pageInfo.endCursor);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (results: GlobalSearchResults) => {
    setSearchResults(results);
  };

  const loadMorePosts = async (): Promise<void> => {
    setIsLoading(true);
    const res = await fetch(`/api/blog-posts?after=${endCursor}`);
    const data = (await res.json()) as IndexPageProps['allPosts'];
    setPosts((prev) => [...prev, ...data.edges]);
    setHasNextPage(data.pageInfo.hasNextPage);
    setEndCursor(data.pageInfo.endCursor);
    setIsLoading(false);
  };

  const heroPost = posts[0]?.node;
  const morePosts = posts.slice(1);

  const seo = {
    opengraphImage: allPosts.edges[0].node.seo.opengraphImage,
    opengraphTitle: `The Blog - World Of Winfield`,
    opengraphDescription: `Read the latest posts from James Winfield covering travel, music, culture, politics, and more.`,
    opengraphSiteName: `World Of Winfield`,
  };

  return (
    <Layout preview={preview} seo={seo} ogType="website">
      <Container>
        <VisuallyHiddenH1>The Blog</VisuallyHiddenH1>
        {heroPost && (
          <HeroPost
            title={heroPost.title}
            date={heroPost.date}
            author={heroPost.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
            featuredImage={heroPost.featuredImage}
          />
        )}
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        {hasNextPage && (
          <LoadMoreContainer>
            <LoadMoreButton onClick={loadMorePosts} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Load more'}
            </LoadMoreButton>
          </LoadMoreContainer>
        )}
      </Container>
      <BrowseTopicsBar aria-label="Blog navigation">
        <Link href="/tags">
          Browse all topics <span aria-hidden="true">→</span>
        </Link>
        <Link href="/year-in-review">
          Year in Review <span aria-hidden="true">→</span>
        </Link>
        <RssLink href="/api/feed">Subscribe via RSS</RssLink>
      </BrowseTopicsBar>
      <SearchBar<GlobalSearchResults>
        onSearch={handleSearch}
        endpoint="/api/global-search"
        label="Search everything"
        placeholder="Search blog, favourites, wish lists..."
      />
      <SearchResults searchResults={searchResults} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview);

  return {
    props: { allPosts, preview },
    revalidate: 3600,
  };
};

const VisuallyHiddenH1 = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

const BrowseTopicsBar = styled.nav`
  text-align: center;
  padding: 1rem 0;

  a {
    font-size: 1rem;
    color: #000;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }

    &:focus-visible {
      outline: 2px solid #000;
      outline-offset: 2px;
    }
  }
`;

const RssLink = styled.a`
  display: block;
  font-size: 0.875rem;
  color: #000;
  text-decoration: none;
  margin-top: 0.5rem;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid #000;
    outline-offset: 2px;
  }
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem 0;
`;

const LoadMoreButton = styled.button`
  background: #000;
  color: #fff;
  border: none;
  padding: 12px 32px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.05em;

  &:hover:not(:disabled) {
    background: #333;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }

  &:focus-visible {
    outline: 2px solid #000;
    outline-offset: 2px;
  }
`;
