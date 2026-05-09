import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import Container from '../components/container';
import FavouritesHubLink from '../components/favourites-hub-link';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import PostTitle from '../components/post-title';
import FavouriteResults from './favourites-results';
export default function FavouritesPage() {
  const title = 'Favourite Cheese';
  const sheetId = '1UDjT7_Q5rBPQasn4o2qxUOsEcElEI67nl-ep9YTLc-E';
  const seo = {
    opengraphTitle: 'Favourite Cheese | World Of Winfield',
    opengraphDescription: "A ranked list of James Winfield's favourite cheeses.",
    opengraphSiteName: 'World Of Winfield',
  };

  const router = useRouter();

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

              <FavouriteResults sheetId={sheetId} />
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
