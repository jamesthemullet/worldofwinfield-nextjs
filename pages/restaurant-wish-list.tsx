import styled from '@emotion/styled';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import type { JSX } from 'react';
import Container from '../components/container';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import PostTitle from '../components/post-title';
import { fetchDataFromGoogleSheets } from '../lib/sheets';
import FavouriteResults from './favourites-results';

const sheetId = '13gz7lPQ61f_WKQ_xio_QBlUcFB9Dl0yVBynwEadVO_4';

type RestaurantWishListProps = {
  data: string[][] | null;
};

export default function WishListPage({ data }: RestaurantWishListProps): JSX.Element {
  const title = 'Restaurant Wish List';
  const seo = {
    opengraphTitle: 'Restaurant Wish List | World Of Winfield',
    opengraphDescription:
      "James Winfield's restaurant wish list — restaurants he still wants to try.",
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

export const getStaticProps: GetStaticProps<RestaurantWishListProps> = async () => {
  const data = await fetchDataFromGoogleSheets(sheetId);

  return {
    props: { data },
    revalidate: 3600,
  };
};
