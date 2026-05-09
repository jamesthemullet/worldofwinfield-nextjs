import styled from '@emotion/styled';
import { GetStaticProps } from 'next';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import Container from '../components/container';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import PostTitle from '../components/post-title';
import { filterPostsByTag } from '../lib/api';
import { sanitize } from '../lib/sanitize';
import { PostsProps } from '../lib/types';
import { colours } from './_app';

export default function Post({ posts }: PostsProps) {
  const router = useRouter();

  if (!router.isFallback && !posts?.length) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout preview={null} seo={posts[0]?.seo} title="Posts About Goals">
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            {posts.map((post, index) => (
              <PostContainer key={post.id} isEven={index % 2 === 0}>
                <StyledPostHeader>
                  <PostHeader
                    title={post.title}
                    coverImage={post.featuredImage}
                    date={post.date}
                    author={post.author}
                    categories={post.categories}
                    slug={post.slug}
                    heroPost={index === 0 || index === 1 ? true : false}
                  />
                </StyledPostHeader>
                <StyledExcerpt
                  dangerouslySetInnerHTML={{ __html: sanitize(post.excerpt) }}
                  backgroundColour={colours.dark}></StyledExcerpt>
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
    revalidate: 3600,
  };
};

const StyledExcerpt = styled.div<{ backgroundColour: string }>`
  font-size: 1.2rem;
  line-height: 1.5;
  margin: 4rem auto;
  width: calc(50% - 4rem);
  border-top: 5px solid ${(props) => props.backgroundColour};

  @media screen and (max-width: 768px) {
    width: 100%;
    margin: 0 1rem;
    border: none;

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
    line-height: 4rem;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledPostHeader = styled.div`
  width: 50%;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;
