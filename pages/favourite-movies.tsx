import styled from '@emotion/styled';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import type { JSX } from 'react';
import Container from '../components/container';
import FavouritesHubLink from '../components/favourites-hub-link';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import PostTitle from '../components/post-title';
import ShareBar from '../components/share-bar';
import { fetchDataFromGoogleSheets } from '../lib/sheets';
import { resolveMovieCovers } from '../lib/tmdb';
import FavouriteResults from './favourites-results';

const sheetId = '1q3LFzLYqK0tLWHjvHYxFE1IIF-FrOJuqJ6XBIQIEl6U';

type FavouritesPageProps = {
  data: string[][] | null;
  coverArtByTitle: Record<string, string | null>;
};

export default function FavouritesPage({
  data,
  coverArtByTitle,
}: FavouritesPageProps): JSX.Element {
  const title = 'Favourite Movies';
  const seo = {
    opengraphTitle: 'Favourite Movies | World Of Winfield',
    opengraphDescription: "A ranked list of James Winfield's favourite movies.",
    opengraphSiteName: 'World Of Winfield',
  };

  const router = useRouter();

  return (
    <Layout preview={null} title={title} seo={seo}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <PostContainer>
              <StyledPostHeader>
                <PostHeader
                  title={title}
                  // coverImage={post?.featuredImage}
                  // date={post.date}
                  // author="James Winfield"
                  // categories={post.categories}
                />
              </StyledPostHeader>

              <FavouriteResults data={data} coverArtByTitle={coverArtByTitle} />
              <ShareBar title={title} url={`https://worldofwinfield.co.uk${router.asPath}`} />
              <FavouritesHubLink />
            </PostContainer>
          </>
        )}
      </Container>
    </Layout>
  );
}

const PostContainer = styled.article`
  h1 {
    font-size: 3rem;
    line-height: 4rem;
  }
`;

const StyledPostHeader = styled.div`
  margin: 0 auto;
`;

export const getStaticProps: GetStaticProps<FavouritesPageProps> = async () => {
  const data = await fetchDataFromGoogleSheets(sheetId);

  let coverArtByTitle: Record<string, string | null> = {};
  if (data && data.length > 1) {
    const headerRow = data[0];
    const titleIndex = headerRow.indexOf('Name');

    if (titleIndex !== -1) {
      coverArtByTitle = await resolveMovieCovers(
        data.slice(1).map((row) => ({ title: row[titleIndex] })),
      );
    }
  }

  return {
    props: { data, coverArtByTitle },
    revalidate: 3600,
  };
};
