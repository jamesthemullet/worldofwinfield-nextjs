import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { GetStaticPaths, GetStaticProps } from 'next';
import Container from '../../components/container';
import PostHeader from '../../components/post-header';
import Layout from '../../components/layout';
import PostTitle from '../../components/post-title';
import { getPostsByTag } from '../../lib/api';

import { TagsPostProps } from '../../lib/types';
import Link from 'next/link';
import { ContentContainer } from '../../components/post-body';
import Date from '../../components/date';
import CoverImage from '../../components/cover-image';
import styled from '@emotion/styled';
import { sanitize } from '../../lib/sanitize';
import { colours } from '../_app';

const blockColours = [
  colours.pink,
  colours.green,
  colours.purple,
  colours.burgandy,
  colours.dark,
  colours.azure,
  colours.blueish,
];

const getColourFromTitle = (title: string) => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) & 0xffffffff;
  }
  return blockColours[Math.abs(hash) % blockColours.length];
};

const stripReadMoreParagraph = (excerpt: string) => {
  return excerpt.replace(/\s*<a\b[^>]*>.*?<\/a>/gi, '').trim();
};

export default function Post({ posts, tag }: TagsPostProps) {
  const router = useRouter();

  if (!router.isFallback && !posts) {
    return <ErrorPage statusCode={404} />;
  }

  const seo = {
    opengraphImage: undefined,
    opengraphTitle: `Posts tagged with ${tag} - World Of Winfield`,
    opengraphDescription: `Posts tagged with ${tag} - World Of Winfield`,
    opengraphSiteName: `World Of Winfield`,
  };

  return (
    <Layout preview={null} seo={seo} title={`Posts tagged with ${tag}`}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <PostHeader title={`Tagged: ${tag}`} />
              <ContentContainer>
                <PostCount>
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'} tagged with {tag}
                </PostCount>
                {posts.map((post) => (
                  <TagPostCard key={post.id}>
                    {post.featuredImage && (
                      <TagPostImageWrapper>
                        <CoverImage
                          title={post.title}
                          coverImage={post.featuredImage}
                          slug={post.slug}
                        />
                      </TagPostImageWrapper>
                    )}
                    <TagPostContent>
                      <TagPostTitle>
                        <Link href={`/${post.slug}`}>{post.title}</Link>
                      </TagPostTitle>
                      <TagPostDate>
                        <Date dateString={post.date} />
                      </TagPostDate>
                      {post.excerpt && (
                        <TagPostExcerpt
                          dangerouslySetInnerHTML={{ __html: sanitize(stripReadMoreParagraph(post.excerpt)) }}
                        />
                      )}
                      <ContinueReadingLink href={`/${post.slug}`} colour={getColourFromTitle(post.title)}>
                        Continue reading
                      </ContinueReadingLink>
                    </TagPostContent>
                  </TagPostCard>
                ))}
              </ContentContainer>
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

const PostCount = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const TagPostImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 240px;
    height: 160px;
  }
`;

const TagPostCard = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1.5rem;
    align-items: flex-start;
  }
`;

const TagPostContent = styled.div`
  flex: 1;
`;

const TagPostTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0.75rem 0 0.25rem;

  @media (min-width: 768px) {
    margin-top: 0;
  }

  a {
    text-decoration: none;
    color: inherit;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const TagPostDate = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const TagPostExcerpt = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 0.75rem;

  p {
    margin: 0;
  }
`;

const ContinueReadingLink = styled(Link)<{ colour: string }>`
  display: inline-block;
  padding: 10px;
  font-size: 1rem;
  min-width: 100px;
  background-color: ${(props) => props.colour};
  color: ${colours.white};
  font-weight: bold;
  text-decoration: none;
  text-align: center;

  &:hover {
    opacity: 0.85;
  }
`;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tag = params?.tag as string;
  const data = await getPostsByTag(tag);

  return {
    props: {
      posts: data,
      tag,
    },
    revalidate: 3600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const frequentlyUsedTags = [
    'react',
    'javascript',
    'nextjs',
    'travel',
    'food',
    'lifestyle',
    'personal',
  ];

  const paths = frequentlyUsedTags.map((tag) => ({
    params: { tag },
  }));

  return { paths, fallback: 'blocking' };
};
