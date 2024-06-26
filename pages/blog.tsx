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

export default function Index({ allPosts: { edges }, preview }: IndexPageProps) {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (results) => {
    setSearchResults(results);
  };
  const heroPost = edges[0]?.node;
  const morePosts = edges.slice(1);

  const seo = {
    opengraphImage: edges[0].node.seo.opengraphImage,
    opengraphTitle: `The Blog - World Of Winfield`,
    opengraphDescription: `The Blog - World Of Winfield`,
    opengraphSiteName: `World Of Winfield`,
  };

  return (
    <Layout preview={preview} seo={seo}>
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
      </Container>
      <SearchBar onSearch={handleSearch} />
      <SearchResults searchResults={searchResults} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview);

  return {
    props: { allPosts, preview },
    revalidate: 10,
  };
};
