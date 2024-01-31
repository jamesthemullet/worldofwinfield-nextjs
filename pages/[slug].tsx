import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import Container from '../components/container';
import PostBody from '../components/post-body';
import PostHeader from '../components/post-header';
import SectionSeparator from '../components/section-separator';
import Layout from '../components/layout';
import PostTitle from '../components/post-title';
import Tags from '../components/tags';
import { getAllPostsWithSlug, getPost } from '../lib/api';
import { CMS_NAME } from '../lib/constants';
import { PostProps } from '../lib/types';
import PrePost from '../components/pre-post';

export default function Post({ post, preview }: PostProps) {
  const router = useRouter();

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout preview={preview} seo={post?.seo}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>{`${post.title} | Next.js Blog Example with ${CMS_NAME}`}</title>
                <meta property="og:image" content={post.featuredImage?.node.sourceUrl} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.featuredImage}
                date={post.date}
                author={post.author}
                categories={post.categories}
                heroPost={true}
              />
              <PrePost tags={post.tags} date={post.date} />
              <PostBody content={post.content} />
              <p>{post.tags.edges.length > 0 && <Tags tags={post.tags} />}</p>
            </article>

            <SectionSeparator />
          </>
        )}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const data = await getPost(params?.slug);

  return {
    props: {
      post: data,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getAllPostsWithSlug();

  return {
    paths: allPosts.edges.map(({ node }) => `/${node.slug}`) || [],
    fallback: true,
  };
};
