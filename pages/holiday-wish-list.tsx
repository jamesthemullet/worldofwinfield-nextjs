import { useRouter } from 'next/router';
import Container from '../components/container';
import PostHeader from '../components/post-header';
import Layout from '../components/layout';
import PostTitle from '../components/post-title';
import styled from '@emotion/styled';
import FavouriteResults from './favourites-results';
import SortDropdown from '../components/SortDropdown';
import { useState } from 'react';

export default function WishListPage() {
  const title = 'Holiday Wish List';
  const sheetId = '1GX6KF20f3Nrb3m8T9th7UIV_uuePj4Ivlc_yLgo-4Bo';

  const router = useRouter();
  const [selectedSort, setSelectedSort] = useState('');

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
                <SortDropdown
                  options={['Country', 'Name']}
                  selected={selectedSort}
                  onChange={setSelectedSort}
                />
              </DropdownContainer>
              <FavouriteResults sheetId={sheetId} indexRequired={false} sortBy={selectedSort} />
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
