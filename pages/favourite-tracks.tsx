import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Container from '../components/container';
import FavouritesHubLink from '../components/favourites-hub-link';
import GenreDropdown from '../components/GenreDropdown';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import PostTitle from '../components/post-title';
import FavouriteResults from './favourites-results';

export default function FavouritesPage() {
  const title = 'Favourite Tracks';
  const sheetId = '1ifEAiSgIMKrtTJ6fSHNGmQ-kMzR_MyAa-PjvBWOsBRA';
  const columnsToHide = ['Date Added'];
  const indexRequired = false;
  const seo = {
    opengraphTitle: 'Favourite Tracks | World Of Winfield',
    opengraphDescription: "A ranked list of James Winfield's favourite music tracks.",
    opengraphSiteName: 'World Of Winfield',
  };

  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState('Artist/Track Name');

  useEffect(() => {
    async function fetchFilterOptions() {
      const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
      const SHEET_NAME = 'Sheet1';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${SHEET_NAME}?alt=json&key=${API_KEY}`;
      try {
        const response = await fetch(url);
        const json = await response.json();
        const values: string[][] = json.values;
        if (!values || values.length === 0) return;
        const headerRow = values[0];

        const genreIndex = headerRow.indexOf('Genre');
        if (genreIndex !== -1) {
          const genreSet = new Set<string>();
          for (let i = 1; i < values.length; i++) {
            const genre = values[i][genreIndex];
            if (genre) genreSet.add(genre);
          }
          setGenres(Array.from(genreSet).sort());
        }

        const labelIndex = headerRow.indexOf('Label');
        if (labelIndex !== -1) {
          const labelSet = new Set<string>();
          for (let i = 1; i < values.length; i++) {
            const label = values[i][labelIndex];
            if (label) labelSet.add(label);
          }
          setLabels(Array.from(labelSet).sort());
        }
      } catch (err) {
        console.error('Failed to fetch filter options', err);
      }
    }
    fetchFilterOptions();
  }, [sheetId]);

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
                sheetId={sheetId}
                columnsToHide={columnsToHide}
                indexRequired={indexRequired}
                sortBy={selectedSort}
                genreFilter={selectedGenre}
                labelFilter={selectedLabel}
              />
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
