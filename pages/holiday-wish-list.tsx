import styled from '@emotion/styled';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Container from '../components/container';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import PostTitle from '../components/post-title';
import SortDropdown from '../components/SortDropdown';
import { fetchDataFromGoogleSheets } from '../lib/sheets';
import { resolveWishListCovers } from '../lib/wish-list-covers';
import FavouriteResults from './favourites-results';

const sheetId = '1GX6KF20f3Nrb3m8T9th7UIV_uuePj4Ivlc_yLgo-4Bo';

type WishListPageProps = {
  data: string[][] | null;
  coverArtByTitle: Record<string, string | null>;
};

export default function WishListPage({ data, coverArtByTitle }: WishListPageProps) {
  const title = 'Holiday Wish List';
  const seo = {
    opengraphTitle: 'Holiday Wish List | World Of Winfield',
    opengraphDescription:
      "James Winfield's holiday wish list — places around the world still to visit.",
    opengraphSiteName: 'World Of Winfield',
  };

  const router = useRouter();
  const [selectedSort, setSelectedSort] = useState('');

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

              <DropdownContainer>
                <SortDropdown
                  options={['Name', 'Country']}
                  selected={selectedSort}
                  onChange={setSelectedSort}
                />
              </DropdownContainer>
              <FavouriteResults
                data={data}
                indexRequired={false}
                sortBy={selectedSort}
                coverArtByTitle={coverArtByTitle}
              />
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

const DropdownContainer = styled.div`
  margin: 50px auto 20px;
  display: flex;
  justify-content: center;
`;

export const getStaticProps: GetStaticProps = async () => {
  const data = await fetchDataFromGoogleSheets(sheetId);

  let coverArtByTitle: Record<string, string | null> = {};
  if (data && data.length > 1) {
    const headerRow = data[0];
    const nameIndex = headerRow.indexOf('Name');

    if (nameIndex !== -1) {
      coverArtByTitle = resolveWishListCovers(data.slice(1).map((row) => row[nameIndex]));
    }
  }

  return {
    props: { data, coverArtByTitle },
    revalidate: 3600,
  };
};
