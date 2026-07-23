import styled from '@emotion/styled';
import type { GetStaticPaths, GetStaticProps } from 'next';
import ErrorPage from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Container from '../../components/container';
import CoverImage from '../../components/cover-image';
import PostDate from '../../components/date';
import Layout from '../../components/layout';
import { ContentContainer } from '../../components/post-body';
import PostHeader from '../../components/post-header';
import PostTitle from '../../components/post-title';
import { getPostsByYear } from '../../lib/api';
import { sanitize } from '../../lib/sanitize';
import type { YearInReviewProps } from '../../lib/types';

const FIRST_YEAR = 2018;

const stripReadMoreParagraph = (excerpt: string) => {
  return excerpt.replace(/\s*<a\b[^>]*>.*?<\/a>/gi, '').trim();
};

export default function YearInReview({ posts, year }: YearInReviewProps) {
  const router = useRouter();

  if (!router.isFallback && !posts) {
    return <ErrorPage statusCode={404} />;
  }

  const seo = {
    opengraphImage: undefined,
    opengraphTitle: `${year} Year in Review - World Of Winfield`,
    opengraphDescription: `A look back at ${year}: everything written on World Of Winfield that year.`,
    opengraphSiteName: `World Of Winfield`,
  };

  return (
    <Layout preview={null} seo={seo} title={`${year} Year in Review`}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <article>
            <PostHeader title={`${year} Year in Review`} />
            <ContentContainer>
              <YearNav aria-label="Year in Review navigation">
                {year > FIRST_YEAR && (
                  <Link
                    href={`/year-in-review/${year - 1}`}
                    aria-label={`Previous year: ${year - 1}`}>
                    <span aria-hidden="true">← </span>
                    {year - 1}
                  </Link>
                )}
                <Link href="/year-in-review">All years</Link>
                {year < new Date().getFullYear() && (
                  <Link href={`/year-in-review/${year + 1}`} aria-label={`Next year: ${year + 1}`}>
                    {year + 1}
                    <span aria-hidden="true"> →</span>
                  </Link>
                )}
              </YearNav>
              <PostCount>
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} written in {year}
              </PostCount>
              {posts.length === 0 ? (
                <NoPostsMessage>No posts found for {year}</NoPostsMessage>
              ) : (
                posts.map((post) => (
                  <YearPostCard key={post.id}>
                    {post.featuredImage && (
                      <YearPostImageWrapper>
                        <CoverImage
                          title={post.title}
                          coverImage={post.featuredImage}
                          slug={post.slug}
                        />
                      </YearPostImageWrapper>
                    )}
                    <YearPostContent>
                      <YearPostTitle>
                        <Link href={`/${post.slug}`}>{post.title}</Link>
                      </YearPostTitle>
                      <YearPostDate>
                        <PostDate dateString={post.date} />
                      </YearPostDate>
                      {post.excerpt && (
                        <YearPostExcerpt
                          dangerouslySetInnerHTML={{
                            __html: sanitize(stripReadMoreParagraph(post.excerpt)),
                          }}
                        />
                      )}
                    </YearPostContent>
                  </YearPostCard>
                ))
              )}
            </ContentContainer>
          </article>
        )}
      </Container>
    </Layout>
  );
}

const YearNav = styled.nav`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;

  a {
    color: inherit;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const PostCount = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const NoPostsMessage = styled.p`
  font-size: 1.25rem;
  padding: 2rem 0;
  text-align: center;
`;

const YearPostImageWrapper = styled.div`
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

const YearPostCard = styled.div`
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

const YearPostContent = styled.div`
  flex: 1;
`;

const YearPostTitle = styled.h2`
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

const YearPostDate = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const YearPostExcerpt = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 0.75rem;

  p {
    margin: 0;
  }
`;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const year = parseInt(params?.year as string, 10);
  const posts = await getPostsByYear(year);

  return {
    props: {
      posts,
      year,
    },
    revalidate: 3600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - FIRST_YEAR + 1 }, (_, i) => FIRST_YEAR + i);
  const paths = years.map((year) => ({ params: { year: String(year) } }));
  return { paths, fallback: 'blocking' };
};
