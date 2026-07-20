import type { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Container from '../components/container';
import Layout from '../components/layout';
import PostBody from '../components/post-body';
import PostHeader from '../components/post-header';
import PostNavigation from '../components/post-navigation';
import PostTitle from '../components/post-title';
import PrePost from '../components/pre-post';
import RelatedPosts from '../components/related-posts';
import SectionSeparator from '../components/section-separator';
import ShareBar from '../components/share-bar';
import Tags from '../components/tags';
import { getAdjacentPosts, getAllPostsWithSlug, getPost, getRelatedPosts } from '../lib/api';
import type { PostProps } from '../lib/types';
import Custom404 from './404';

const SITE_URL = 'https://www.worldofwinfield.co.uk';

export default function Post({ post, preview, relatedPosts, adjacentPosts }: PostProps) {
  const router = useRouter();

  if (!router.isFallback && !post?.slug) {
    return <Custom404 />;
  }

  const jsonLd: Record<string, unknown> | undefined =
    !router.isFallback && post
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          datePublished: post.date,
          dateModified: post.modified ?? post.date,
          author: {
            '@type': 'Person',
            name: post.author?.node?.name ?? 'James Winfield',
            url: SITE_URL,
          },
          publisher: {
            '@type': 'Person',
            name: 'James Winfield',
            url: SITE_URL,
          },
          ...(post.seo?.opengraphImage?.mediaItemUrl
            ? { image: post.seo.opengraphImage.mediaItemUrl }
            : post.featuredImage?.node?.sourceUrl
              ? { image: post.featuredImage.node.sourceUrl }
              : {}),
          description: post.seo?.opengraphDescription,
          url: `${SITE_URL}/${post.slug}`,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/${post.slug}`,
          },
        }
      : undefined;

  return (
    <Layout
      preview={preview}
      seo={post?.seo}
      ogType="article"
      articleDate={post?.date}
      articleModified={post?.modified}
      articleAuthor={post?.author?.node?.name}
      jsonLd={jsonLd}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            {' '}
            <article>
              <PostHeader
                title={post.title}
                coverImage={post.featuredImage}
                date={post.date}
                author={post.author}
                categories={post.categories}
                heroPost={true}
                caption={post.featuredImage?.node.caption}
              />
              <PrePost tags={post.tags} date={post.date} content={post.content} />
              <PostBody content={post.content} />
              {post.tags.edges.length > 0 && <Tags tags={post.tags} />}
              <ShareBar title={post.title} url={`https://worldofwinfield.co.uk/${post.slug}`} />
            </article>
            {relatedPosts?.length > 0 && <RelatedPosts posts={relatedPosts} />}
            <PostNavigation
              previousPost={adjacentPosts?.previousPost ?? null}
              nextPost={adjacentPosts?.nextPost ?? null}
            />
            <SectionSeparator />
          </>
        )}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params, preview = false }) => {
  const slug = params?.slug as string;

  if (!slug || !/^[a-zA-Z0-9-]+$/.test(slug)) {
    return { notFound: true };
  }

  const data = await getPost(slug);

  if (!data) {
    return { notFound: true };
  }

  const firstTag = data?.tags?.edges?.[0]?.node?.name;
  const [relatedPosts, adjacentPosts] = await Promise.all([
    firstTag ? getRelatedPosts(firstTag, slug) : Promise.resolve([]),
    getAdjacentPosts(data.date),
  ]);

  return {
    props: {
      post: data,
      preview,
      relatedPosts,
      adjacentPosts,
    },
    revalidate: 3600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getAllPostsWithSlug();

  return {
    paths: allPosts.edges.map(({ node }: { node: { slug: string } }) => `/${node.slug}`),
    fallback: true,
  };
};
