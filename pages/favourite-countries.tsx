import { useState } from 'react';
import { useRouter } from 'next/router';
import Container from '../components/container';
import PostHeader from '../components/post-header';
import Layout from '../components/layout';
import PostTitle from '../components/post-title';
import styled from '@emotion/styled';
import FavouriteResults from './favourites-results';
import FavouritesHubLink from '../components/favourites-hub-link';
import SortDropdown from '../components/SortDropdown';

export default function FavouritesPage() {
  const title = 'Favourite Countries Visited';
  const sheetId = '1zyzuLzWY0S6mUp-FVjcIa3QFAENcU94WVD9ZF0JWERY';
  const seo = {
    opengraphTitle: 'Favourite Countries Visited | World Of Winfield',
    opengraphDescription: "A ranked list of James Winfield's favourite countries visited.",
    opengraphSiteName: 'World Of Winfield',
  };
  const sortOptions = ['Score', 'Name'];

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

              <SortDropdown options={sortOptions} selected={selectedSort} onChange={setSelectedSort} />
              <FavouriteResults sheetId={sheetId} sortBy={selectedSort} />
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
