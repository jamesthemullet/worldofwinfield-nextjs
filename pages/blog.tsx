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
import type { IndexPageProps, SearchResult } from '../lib/types';

export default function Index({ allPosts, preview }: IndexPageProps) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [posts, setPosts] = useState(allPosts.edges);
  const [hasNextPage, setHasNextPage] = useState(allPosts.pageInfo.hasNextPage);
  const [endCursor, setEndCursor] = useState(allPosts.pageInfo.endCursor);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const loadMorePosts = async (): Promise<void> => {
    setIsLoading(true);
    const res = await fetch(`/api/blog-posts?after=${endCursor}`);
    const data = await res.json();
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
    opengraphDescription: `The Blog - World Of Winfield`,
    opengraphSiteName: `World Of Winfield`,
  };

  return (
    <Layout preview={preview} seo={seo} ogType="website">
      <Container>
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
      <BrowseTopicsBar>
        <Link href="/tags">Browse all topics →</Link>
        <Link href="/year-in-review">Year in Review →</Link>
        <RssLink href="/api/feed">Subscribe via RSS</RssLink>
      </BrowseTopicsBar>
      <SearchBar onSearch={handleSearch} />
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

const BrowseTopicsBar = styled.div`
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
`;
