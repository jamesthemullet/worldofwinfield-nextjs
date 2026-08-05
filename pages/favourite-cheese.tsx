import styled from '@emotion/styled';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Container from '../components/container';
import FavouritesHubLink from '../components/favourites-hub-link';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import PostTitle from '../components/post-title';
import ShareBar from '../components/share-bar';
import { fetchDataFromGoogleSheets } from '../lib/sheets';
import FavouriteResults from './favourites-results';

const sheetId = '1UDjT7_Q5rBPQasn4o2qxUOsEcElEI67nl-ep9YTLc-E';

export default function FavouritesPage({ data }: { data: string[][] | null }) {
  const title = 'Favourite Cheese';
  const seo = {
    opengraphTitle: 'Favourite Cheese | World Of Winfield',
    opengraphDescription: "A ranked list of James Winfield's favourite cheeses.",
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

              <FavouriteResults data={data} />
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

  return {
    props: { data },
    revalidate: 3600,
  };
};
