import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import Container from '../components/container';
import PostHeader from '../components/post-header';
import Layout from '../components/layout';
import PostTitle from '../components/post-title';
import { filterPostsByTag } from '../lib/api';
import { CMS_NAME } from '../lib/constants';
import { PostsProps } from '../lib/types';
import styled from '@emotion/styled';

export default function Post({ posts }: PostsProps) {
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
            {posts.map((post, index) => (
              <PostContainer key={post.id} isEven={index % 2 === 0}>
                <Head>
                  <title>{`${post.title} | Next.js Blog Example with ${CMS_NAME}`}</title>
                  <meta property="og:image" content={post.featuredImage?.node.sourceUrl} />
                </Head>
                <StyledPostHeader>
                  <PostHeader
                    title={post.title}
                    coverImage={post.featuredImage}
                    date={post.date}
                    author={post.author}
                    categories={post.categories}
                    slug={post.slug}
                  />
                </StyledPostHeader>
                <StyledExcerpt dangerouslySetInnerHTML={{ __html: post.excerpt }}></StyledExcerpt>
              </PostContainer>
            ))}
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

const StyledExcerpt = styled.div`
  font-size: 1.2rem;
  line-height: 1.5;
  margin: 4rem auto;
  width: calc(50% - 4rem);

  @media screen and (max-width: 768px) {
    width: 100%;
    margin: 0 1rem;

    p {
      margin: 1rem;
    }
  }
`;

const PostContainer = styled.article<{ isEven: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isEven ? 'row' : 'row-reverse')};
  align-items: center;
  max-width: 1268px;
  margin: 0 auto;

  h1 {
    font-size: 3rem;
    padding: 1rem;
    line-height: 4rem;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledPostHeader = styled.div`
  margin: 0 auto;
  width: 50%;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;
