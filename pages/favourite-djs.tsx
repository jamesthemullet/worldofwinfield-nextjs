import styled from '@emotion/styled';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Container from '../components/container';
import FavouritesHubLink from '../components/favourites-hub-link';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import PostTitle from '../components/post-title';
import ShareBar from '../components/share-bar';
import djCovers from '../lib/data/dj-covers.json';
import { fetchDataFromGoogleSheets } from '../lib/sheets';
import FavouriteResults from './favourites-results';

const sheetId = '1_zpDBFlpW2ZWTVsXQHoW6Y4FbGw8Vi53nMYpZiOypbg';

type FavouritesPageProps = {
  data: string[][] | null;
  coverArtByTitle: Record<string, string | null>;
};

export default function FavouritesPage({ data, coverArtByTitle }: FavouritesPageProps) {
  const title = 'Favourite DJs';
  const seo = {
    opengraphTitle: 'Favourite DJs | World Of Winfield',
    opengraphDescription: "A ranked list of James Winfield's favourite DJs.",
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

// Cover art is resolved offline by scripts/resolve-dj-covers.js (against
// Discogs) and committed to lib/data/dj-covers.json, rather than looked up
// live here — Discogs' rate limit is too slow for ~200 DJs within an ISR
// revalidation. Re-run that script and commit the updated JSON when the DJ
// list changes.
export const getStaticProps: GetStaticProps = async () => {
  const data = await fetchDataFromGoogleSheets(sheetId);

  return {
    props: { data, coverArtByTitle: djCovers },
    revalidate: 3600,
  };
};
