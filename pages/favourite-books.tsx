import styled from '@emotion/styled';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Container from '../components/container';
import FavouritesHubLink from '../components/favourites-hub-link';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import PostTitle from '../components/post-title';
import ShareBar from '../components/share-bar';
import { resolveBookCovers } from '../lib/open-library';
import { fetchDataFromGoogleSheets } from '../lib/sheets';
import FavouriteResults from './favourites-results';

const sheetId = '1G-QrN1NDpKAr12VyIi50Nod8_g-YOSGP3bovCXxDHlY';

type FavouritesPageProps = {
  data: string[][] | null;
  coverArtByTitle: Record<string, string | null>;
};

export default function FavouritesPage({ data, coverArtByTitle }: FavouritesPageProps) {
  const title = 'Favourite Books';
  const seo = {
    opengraphTitle: 'Favourite Books | World Of Winfield',
    opengraphDescription: "A ranked list of James Winfield's favourite books.",
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

export const getStaticProps: GetStaticProps = async () => {
  const data = await fetchDataFromGoogleSheets(sheetId);

  let coverArtByTitle: Record<string, string | null> = {};
  if (data && data.length > 1) {
    const headerRow = data[0];
    const titleIndex = headerRow.indexOf('Title');
    const authorIndex = headerRow.indexOf('Author');

    if (titleIndex !== -1) {
      coverArtByTitle = await resolveBookCovers(
        data.slice(1).map((row) => ({
          title: row[titleIndex],
          author: authorIndex !== -1 ? row[authorIndex] : undefined,
        })),
      );
    }
  }

  return {
    props: { data, coverArtByTitle },
    revalidate: 3600,
  };
};
