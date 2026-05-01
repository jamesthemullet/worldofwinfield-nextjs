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
import styled from '@emotion/styled';
import { sanitize } from '../../lib/sanitize';

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
                    <TagPostTitle>
                      <Link href={`/${post.slug}`}>{post.title}</Link>
                    </TagPostTitle>
                    <TagPostDate>
                      <Date dateString={post.date} />
                    </TagPostDate>
                    {post.excerpt && (
                      <TagPostExcerpt
                        dangerouslySetInnerHTML={{ __html: sanitize(post.excerpt) }}
                      />
                    )}
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

const TagPostCard = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const TagPostTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 0.25rem;

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

  p {
    margin: 0;
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
