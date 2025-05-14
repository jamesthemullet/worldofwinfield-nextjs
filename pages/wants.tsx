import { useRouter } from 'next/router';
import Container from '../components/container';
import PostHeader from '../components/post-header';
import Layout from '../components/layout';
import PostTitle from '../components/post-title';
import styled from '@emotion/styled';
import { useState } from 'react';
import FavouriteResults from './favourites-results';
import { StyledButton } from '../components/core-components';

export default function WantsPage() {
  const [selectedType, setSelectedType] = useState(null);

  const handleTypeClick = (type) => {
    setSelectedType(type);
  };

  const router = useRouter();

  return (
    <Layout preview={null} title="Posts About Wants">
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
                <StyledButton onClick={() => handleTypeClick('wantToVisitSheetID')}>
                  Want To Visit
                </StyledButton>
                <StyledButton onClick={() => handleTypeClick('wantToEatHereSheetID')}>
                  Want To Eat Here
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
