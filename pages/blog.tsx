import { GetStaticProps } from 'next';
import { useState } from 'react';
import Container from '../components/container';
import MoreStories from '../components/more-stories';
import HeroPost from '../components/hero-post';
import Layout from '../components/layout';
import { getAllPostsForHome } from '../lib/api';
import { IndexPageProps } from '../lib/types';
import SearchBar from '../components/search-bar';
import SearchResults from '../components/search-results';
import styled from '@emotion/styled';

export default function Index({ allPosts, preview }: IndexPageProps) {
  const [searchResults, setSearchResults] = useState<{ slug: string; title: string; date: string; content: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState(allPosts.edges);
  const [hasNextPage, setHasNextPage] = useState(allPosts.pageInfo.hasNextPage);
  const [endCursor, setEndCursor] = useState(allPosts.pageInfo.endCursor);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (results: { slug: string; title: string; date: string; content: string }[], query: string) => {
    setSearchResults(results);
    setSearchTerm(query);
  };

  const loadMorePosts = async () => {
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
      <SearchBar onSearch={handleSearch} />
      <SearchResults searchResults={searchResults} searchTerm={searchTerm} />
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
