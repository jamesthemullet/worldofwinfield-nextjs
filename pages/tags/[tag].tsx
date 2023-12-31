import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import Container from '../../components/container';
import PostHeader from '../../components/post-header';
import Layout from '../../components/layout';
import PostTitle from '../../components/post-title';
import { getPostsByTag } from '../../lib/api';

import { TagsPostProps } from '../../lib/types';
import Link from 'next/link';
import { ContentContainer } from '../../components/post-body';

export default function Post({ posts, tag }: TagsPostProps) {
  const router = useRouter();

  if (!router.isFallback && !posts) {
    return <ErrorPage statusCode={404} />;
  }

  // need to do tags seo

  return (
    <Layout preview={null} seo={null}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>Posts tagged with {tag}</title>
              </Head>
              <PostHeader
                title={`Tagged: ${tag}`}
                coverImage={null}
                date={null}
                author={null}
                categories={null}
              />
              <ContentContainer>
                <p>All the posts that are tagged with {tag}</p>
                {posts.map((post) => (
                  <div key={post.id}>
                    <Link href={`/${post.slug}`} aria-label={post.title}>
                      {post.title}
                    </Link>
                  </div>
                ))}
              </ContentContainer>
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const data = await getPostsByTag(params.tag);

  return {
    props: {
      posts: data,
      tag: params.tag,
    },
    revalidate: 10,
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
