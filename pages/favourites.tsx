import Link from 'next/link';
import Image from 'next/image';
import Container from '../components/container';
import PostHeader from '../components/post-header';
import Layout from '../components/layout';
import styled from '@emotion/styled';
import { colours } from './_app';

const categories = [
  { title: 'Books', url: '/favourite-books', icon: null },
  { title: 'Beers', url: '/favourite-beers', icon: null },
  { title: 'Cheese', url: '/favourite-cheese', icon: null },
  { title: 'Cities', url: '/favourite-cities', icon: null },
  { title: 'Countries', url: '/favourite-countries', icon: null },
  { title: 'DJs', url: '/favourite-djs', icon: null },
  { title: 'Movies', url: '/favourite-movies', icon: null },
  { title: 'Restaurants', url: '/favourite-restaurants', icon: null },
  { title: 'Tracks', url: '/favourite-tracks', icon: null },
  { title: 'Articles', url: '/favourite-articles', icon: null },
];

const tileColours = [
  colours.pink,
  colours.green,
  colours.purple,
  colours.burgandy,
  colours.dark,
  colours.azure,
  colours.blueish,
  colours.pink,
  colours.green,
  colours.purple,
];

const seo = {
  opengraphTitle: 'Favourites | World Of Winfield',
  opengraphDescription: "Browse all of James Winfield's favourites lists.",
  opengraphSiteName: 'World Of Winfield',
};

export default function FavouritesHubPage() {
  return (
    <Layout preview={null} title="Favourites" seo={seo}>
      <Container>
        <StyledPostHeader>
          <PostHeader title="Favourites" />
        </StyledPostHeader>
        <Grid>
          {categories.map(({ title, url }, index) => (
            <Tile key={url} href={url} backgroundColour={tileColours[index]}>
              <TileInner>
                <StyledIcon>
                  <Image src="/icons/007-star.png" alt="" width={64} height={64} />
                </StyledIcon>
                <p>{title}</p>
              </TileInner>
            </Tile>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
}

const StyledPostHeader = styled.div`
  margin: 0 auto;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media (min-width: 769px) {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    max-width: 1100px;
    margin: 0 auto;
  }
`;

const Tile = styled(Link)<{ backgroundColour: string }>`
  background-color: ${(props) => props.backgroundColour};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  text-decoration: none;
  border: 1px solid #ccc;
  margin: 2px;
  position: relative;
  overflow: hidden;
  width: 100%;

  @media (max-width: 768px) {
    border: 0;
    margin: 0;
    width: 50%;
  }

  &:hover p {
    text-decoration: underline;
  }
`;

const TileInner = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  p {
    font-size: 1.5rem;
    font-weight: 700;
    padding: 0 10px;
    margin: 0;
    text-align: center;
    font-family: 'Oswald', sans-serif;
  }
`;

const StyledIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
