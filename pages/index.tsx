import { GetStaticProps } from 'next';
import Container from '../components/container';
import MoreStories from '../components/more-stories';
import HeroPost from '../components/hero-post';
import Intro from '../components/intro';
import Layout from '../components/layout';
import { getAllPostsForHome, getJamesImages } from '../lib/api';
import { IndexPageProps } from '../lib/types';

export default function Index({ allPosts: { edges }, preview, jamesImages }: IndexPageProps) {
  const heroPost = edges[0]?.node;
  const morePosts = edges.slice(1);
  console.log(2, heroPost);

  return (
    <Layout preview={preview} seo={null}>
      <Intro jamesImages={jamesImages} />
      <Container>
        {heroPost && (
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.featuredImage}
            date={heroPost.date}
            author={heroPost.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
          />
        )}
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview);
  const jamesImages = await getJamesImages({ first: 20 });

  return {
    props: { allPosts, preview, jamesImages },
    revalidate: 10,
  };
};
