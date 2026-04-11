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
