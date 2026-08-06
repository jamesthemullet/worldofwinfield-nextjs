import styled from '@emotion/styled';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Container from '../components/container';
import { StyledButton } from '../components/core-components';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import PostTitle from '../components/post-title';
import { fetchDataFromGoogleSheets } from '../lib/sheets';
import FavouriteResults from './favourites-results';

const holidayWishListSheetId = '1GX6KF20f3Nrb3m8T9th7UIV_uuePj4Ivlc_yLgo-4Bo';
const restaurantWishListSheetId = '13gz7lPQ61f_WKQ_xio_QBlUcFB9Dl0yVBynwEadVO_4';

type WantsPageProps = {
  wantToVisitData: string[][] | null;
  wantToEatData: string[][] | null;
};

export default function WantsPage({ wantToVisitData, wantToEatData }: WantsPageProps) {
  const [selectedType, setSelectedType] = useState<'visit' | 'eat' | null>(null);

  const handleTypeClick = (type: 'visit' | 'eat') => {
    setSelectedType(type);
  };

  const router = useRouter();

  const seo = {
    opengraphTitle: 'Wants | World Of Winfield',
    opengraphDescription: "James Winfield's wish lists — places to visit and restaurants to try.",
    opengraphSiteName: 'World Of Winfield',
  };

  return (
    <Layout preview={null} title="Posts About Wants" seo={seo}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <PostContainer>
              <StyledPostHeader>
                <PostHeader
                  title="I want..."
                  // coverImage={post?.featuredImage}
                  // date={post.date}
                  // author="James Winfield"
                  // categories={post.categories}
                />
              </StyledPostHeader>
              <RowOfButtons>
                <StyledButton
                  onClick={() => handleTypeClick('visit')}
                  aria-pressed={selectedType === 'visit'}>
                  Want To Visit
                </StyledButton>
                <StyledButton
                  onClick={() => handleTypeClick('eat')}
                  aria-pressed={selectedType === 'eat'}>
                  Want To Eat Here
                </StyledButton>
              </RowOfButtons>
              {selectedType === 'visit' && <FavouriteResults data={wantToVisitData} />}
              {selectedType === 'eat' && <FavouriteResults data={wantToEatData} />}
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

const RowOfButtons = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
  margin-left: 20px;

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin: 0.5rem;
  }
`;

export const getStaticProps: GetStaticProps = async () => {
  const [wantToVisitData, wantToEatData] = await Promise.all([
    fetchDataFromGoogleSheets(holidayWishListSheetId),
    fetchDataFromGoogleSheets(restaurantWishListSheetId),
  ]);

  return {
    props: { wantToVisitData, wantToEatData },
    revalidate: 3600,
  };
};
