import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import Container from '../../components/container';
import PostBody from '../../components/post-body';
import MoreStories from '../../components/more-stories';
import PostHeader from '../../components/post-header';
import SectionSeparator from '../../components/section-separator';
import Layout from '../../components/layout';
import PostTitle from '../../components/post-title';
import Tags from '../../components/tags';
import { getAllPostsWithSlug, getPostAndMorePosts, getPostsByTag } from '../../lib/api';
import { CMS_NAME } from '../../lib/constants';
import { PostProps, TagsPostProps } from '../../lib/types';
import Link from 'next/link';

export default function Post({ posts, tag }: TagsPostProps) {
  const router = useRouter();
  // const morePosts = posts?.edges;

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
                {/* <meta property="og:image" content={post.featuredImage?.node.sourceUrl} /> */}
              </Head>
              {posts.map((post) => (
                <div key={post.id}>
                  <Link href={`/${post.slug}`} aria-label={post.title}>
                    {post.title}
                  </Link>
                </div>
              ))}
              {/* <PostHeader
                title={post.title}
                coverImage={post.featuredImage}
                date={post.date}
                author={post.author}
                categories={post.categories}
              />
              <PostBody content={post.content} /> */}
              {/* <footer>{post.tags.edges.length > 0 && <Tags tags={post.tags} />}</footer> */}
            </article>

            <SectionSeparator />
            {/* {morePosts.length > 0 && <MoreStories posts={morePosts} />} */}
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
