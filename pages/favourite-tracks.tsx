import { useRouter } from 'next/router';
import Container from '../components/container';
import PostHeader from '../components/post-header';
import Layout from '../components/layout';
import PostTitle from '../components/post-title';
import styled from '@emotion/styled';
import FavouriteResults from './favourites-results';

export default function FavouritesPage() {
  const title = 'Favourite Tracks';
  const sheetId = '1ifEAiSgIMKrtTJ6fSHNGmQ-kMzR_MyAa-PjvBWOsBRA';
  const columnsToHide = ['Date Added'];
  const indexRequired = false;
  const sortBy = 'Artist/Track Name';

  const router = useRouter();

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

              <FavouriteResults
                sheetId={sheetId}
                columnsToHide={columnsToHide}
                indexRequired={indexRequired}
                sortBy={sortBy}
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
