import { useRouter } from 'next/router';
import Container from '../components/container';
import PostHeader from '../components/post-header';
import Layout from '../components/layout';
import PostTitle from '../components/post-title';
import styled from '@emotion/styled';
import { useState } from 'react';
import FavouriteResults from './favourites-results';
import { StyledButton } from '../components/core-components';

export default function FavouritesPage() {
  const [selectedType, setSelectedType] = useState(null);
  const [pageName, setPageName] = useState('Favourite...');

  const handleTypeClick = ({ id, name }) => {
    setSelectedType(id);
    if (name) {
      setPageName(name);
    } else {
      setPageName('Favourite...');
    }
  };

  const router = useRouter();

  return (
    <Layout preview={null} title="Favourite Things">
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <PostContainer>
              <StyledPostHeader>
                <PostHeader
                  title={pageName}
                  // coverImage={post?.featuredImage}
                  // date={post.date}
                  // author="James Winfield"
                  // categories={post.categories}
                />
              </StyledPostHeader>
              <RowOfButtons>
                <StyledButton
                  onClick={() =>
                    handleTypeClick({ id: 'favouriteMoviesSheetID', name: 'Favourite Movies' })
                  }>
                  Favourite Movies
                </StyledButton>
                <StyledButton
                  onClick={() =>
                    handleTypeClick({ id: 'favouriteBooksSheetID', name: 'Favourite Books' })
                  }>
                  Favourite Books
                </StyledButton>
                <StyledButton
                  onClick={() =>
                    handleTypeClick({ id: 'favouriteDJsSheetID', name: 'Favourite DJs' })
                  }>
                  Favourite DJs
                </StyledButton>
                <StyledButton
                  onClick={() =>
                    handleTypeClick({ id: 'favouriteCheeseSheetID', name: 'Favourite Cheese' })
                  }>
                  Favourite Cheese
                </StyledButton>
                <StyledButton
                  onClick={() =>
                    handleTypeClick({ id: 'favouriteBeerSheetID', name: 'Favourite Beer' })
                  }>
                  Favourite Beer
                </StyledButton>
                <StyledButton
                  onClick={() =>
                    handleTypeClick({
                      id: 'favouriteRestaurantsSheetID',
                      name: 'Favourite Restaurants',
                    })
                  }>
                  Favourite Restaurants
                </StyledButton>
                <StyledButton
                  onClick={() =>
                    handleTypeClick({
                      id: 'favouriteCountriesID',
                      name: 'Favourite Countries Visited',
                    })
                  }>
                  Favourite Countries Visited
                </StyledButton>
                <StyledButton
                  onClick={() =>
                    handleTypeClick({ id: 'favouriteCitiesID', name: 'Favourite Cities Visited' })
                  }>
                  Favourite Cities Visited
                </StyledButton>
              </RowOfButtons>
              {selectedType && <FavouriteResults type={selectedType} />}
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
    padding: 1rem;
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
