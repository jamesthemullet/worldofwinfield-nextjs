import styled from '@emotion/styled';
import type { GetStaticProps } from 'next';
import ErrorPage from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Container from '../components/container';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import PostTitle from '../components/post-title';
import RelatedSections from '../components/related-sections';
import { filterPostsByTag } from '../lib/api';
import { sanitize } from '../lib/sanitize';
import type { PostsProps } from '../lib/types';
import { colours } from './_app';

const stripReadMoreParagraph = (excerpt: string) => {
  return excerpt.replace(/\s*<a\b[^>]*>.*?<\/a>/gi, '').trim();
};

const politicsSeo = {
  opengraphTitle: 'Posts About Politics | World Of Winfield',
  opengraphDescription: 'A collection of posts about politics from World Of Winfield.',
  opengraphSiteName: 'World Of Winfield',
};

export default function Post({ posts }: PostsProps) {
  const router = useRouter();

  if (!router.isFallback && !posts?.length) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout preview={null} seo={politicsSeo} title="Posts About Politics | World Of Winfield">
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
                <ExcerptArea>
                  <StyledExcerpt
                    dangerouslySetInnerHTML={{
                      __html: sanitize(stripReadMoreParagraph(post.excerpt)),
                    }}
                    backgroundColour={colours.dark}
                  />
                  <ReadMoreLink href={`/${post.slug}`}>Read this post →</ReadMoreLink>
                </ExcerptArea>
              </PostContainer>
            ))}
          </>
        )}
        <RelatedSections
          sections={[
            { label: 'Browse by Tag', href: '/tags', colour: colours.burgandy },
            { label: 'All Posts', href: '/blog', colour: colours.dark },
          ]}
        />
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const politicsPosts = await filterPostsByTag('politics');

  return {
    props: {
      posts: politicsPosts,
    },
    revalidate: 3600,
  };
};

const ExcerptArea = styled.div`
  width: calc(50% - 4rem);
  margin: 4rem auto;

  @media screen and (max-width: 768px) {
    width: 100%;
    margin: 0 1rem;
  }
`;

const StyledExcerpt = styled.div<{ backgroundColour: string }>`
  font-size: 1.2rem;
  line-height: 1.5;
  border-top: 5px solid ${(props) => props.backgroundColour};

  @media screen and (max-width: 768px) {
    border: none;

    p {
      margin: 1rem;
    }
  }
`;

const ReadMoreLink = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  padding: 10px;
  font-size: 1rem;
  min-width: 100px;
  background-color: ${colours.burgandy};
  color: ${colours.white};
  font-weight: bold;
  text-decoration: none;
  text-align: center;

  &:hover {
    opacity: 0.85;
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
