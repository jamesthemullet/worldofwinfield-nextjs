import Container from '../components/container';
import Layout from '../components/layout';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import PostHeader from '../components/post-header';
import PostBody from '../components/post-body';
import SectionSeparator from '../components/section-separator';
import { getPage } from '../lib/api';
import type { PageProps } from '../lib/types';

export default function Music({ page }: PageProps) {
  return (
    <Layout preview="">
      <Container>
        <article>
          <Head>
            <title>{`${page.title}`}</title>
            <meta property="og:image" content={page.featuredImage?.node.sourceUrl} />
          </Head>
          <PostHeader
            title={page.title}
            coverImage={page.featuredImage}
            date={page.date}
            author={page.author}
            categories={page.categories}
          />
          <PostBody content={page.content} />
        </article>
        <SectionSeparator />
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const page = await getPage('3606');
  return {
    props: { page },
    revalidate: 10,
  };
};
