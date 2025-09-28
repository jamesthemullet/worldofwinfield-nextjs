import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Container from '../components/container';
import PostHeader from '../components/post-header';
import Layout from '../components/layout';
import PostTitle from '../components/post-title';
import styled from '@emotion/styled';
import FavouriteResults from './favourites-results';
import GenreDropdown from '../components/GenreDropdown';

export default function FavouritesPage() {
  const title = 'Favourite Tracks';
  const sheetId = '1ifEAiSgIMKrtTJ6fSHNGmQ-kMzR_MyAa-PjvBWOsBRA';
  const columnsToHide = ['Date Added'];
  const indexRequired = false;
  const sortBy = 'Artist/Track Name';

  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    async function fetchGenres() {
      const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
      const SHEET_NAME = 'Sheet1';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${SHEET_NAME}?alt=json&key=${API_KEY}`;
      try {
        const response = await axios.get(url);
        const values: string[][] = response.data.values;
        if (!values || values.length === 0) return;
        const headerRow = values[0];
        const genreIndex = headerRow.indexOf('Genre');
        if (genreIndex === -1) return;
        const genreSet = new Set<string>();
        for (let i = 1; i < values.length; i++) {
          const genre = values[i][genreIndex];
          if (genre) genreSet.add(genre);
        }
        setGenres(Array.from(genreSet).sort());
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch genres', err);
      }
    }
    fetchGenres();
  }, [sheetId]);

  return (
    <Layout preview={null} title={title}>
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
              </DropdownContainer>

              <FavouriteResults
                sheetId={sheetId}
                columnsToHide={columnsToHide}
                indexRequired={indexRequired}
                sortBy={sortBy}
                genreFilter={selectedGenre}
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
