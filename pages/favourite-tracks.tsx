import styled from '@emotion/styled';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import Container from '../components/container';
import FavouritesHubLink from '../components/favourites-hub-link';
import GenreDropdown from '../components/GenreDropdown';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import PostTitle from '../components/post-title';
import ShareBar from '../components/share-bar';
import { fetchDataFromGoogleSheets } from '../lib/sheets';
import FavouriteResults from './favourites-results';

const sheetId = '1ifEAiSgIMKrtTJ6fSHNGmQ-kMzR_MyAa-PjvBWOsBRA';

const uniqueSortedColumn = (data: string[][] | null, columnName: string): string[] => {
  if (!data || data.length === 0) return [];
  const headerRow = data[0];
  const columnIndex = headerRow.indexOf(columnName);
  if (columnIndex === -1) return [];

  const values = new Set<string>();
  for (const row of data.slice(1)) {
    const value = row[columnIndex];
    if (value) values.add(value);
  }
  return Array.from(values).sort();
};

export default function FavouritesPage({ data }: { data: string[][] | null }) {
  const title = 'Favourite Tracks';
  const columnsToHide = ['Date Added'];
  const indexRequired = false;
  const seo = {
    opengraphTitle: 'Favourite Tracks | World Of Winfield',
    opengraphDescription: "A ranked list of James Winfield's favourite music tracks.",
    opengraphSiteName: 'World Of Winfield',
  };

  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [selectedSort, setSelectedSort] = useState('Artist/Track Name');

  const genres = useMemo(() => uniqueSortedColumn(data, 'Genre'), [data]);
  const labels = useMemo(() => uniqueSortedColumn(data, 'Label'), [data]);

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
                <GenreDropdown
                  genres={genres}
                  selectedGenre={selectedGenre}
                  onChange={setSelectedGenre}
                />
                <GenreDropdown
                  genres={labels}
                  selectedGenre={selectedLabel}
                  onChange={setSelectedLabel}
                  filterLabel="Filter by label:"
                  allOptionText="All Labels"
                  selectId="label-select"
                />
                <GenreDropdown
                  genres={['Artist/Track Name', 'Year Released', 'Label']}
                  selectedGenre={selectedSort}
                  onChange={setSelectedSort}
                  filterLabel="Sort by:"
                  allOptionText=""
                  selectId="sort-select"
                />
              </DropdownContainer>

              <FavouriteResults
                data={data}
                columnsToHide={columnsToHide}
                indexRequired={indexRequired}
                sortBy={selectedSort}
                genreFilter={selectedGenre}
                labelFilter={selectedLabel}
              />
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

const DropdownContainer = styled.div`
  margin: 50px auto 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem 2rem;
`;

export const getStaticProps: GetStaticProps = async () => {
  const data = await fetchDataFromGoogleSheets(sheetId);

  return {
    props: { data },
    revalidate: 3600,
  };
};
