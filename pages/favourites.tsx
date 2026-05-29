import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Container from '../components/container';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import { fetchDataFromGoogleSheets } from '../lib/sheets';
import { colours } from './_app';

const categories = [
  {
    title: 'Books',
    url: '/favourite-books',
    sheetId: '1G-QrN1NDpKAr12VyIi50Nod8_g-YOSGP3bovCXxDHlY',
  },
  {
    title: 'Beers',
    url: '/favourite-beers',
    sheetId: '1pNNIw849xWrQHtDptwInGs6Un0AZh-fgXUssC3XIrHM',
  },
  {
    title: 'Cheese',
    url: '/favourite-cheese',
    sheetId: '1UDjT7_Q5rBPQasn4o2qxUOsEcElEI67nl-ep9YTLc-E',
  },
  {
    title: 'Cities',
    url: '/favourite-cities',
    sheetId: '1WBfOTfhC70AygxrTcIIgvigzlvOD65WfI9Ysrd3aF5o',
  },
  {
    title: 'Countries',
    url: '/favourite-countries',
    sheetId: '1zyzuLzWY0S6mUp-FVjcIa3QFAENcU94WVD9ZF0JWERY',
  },
  { title: 'DJs', url: '/favourite-djs', sheetId: '1_zpDBFlpW2ZWTVsXQHoW6Y4FbGw8Vi53nMYpZiOypbg' },
  {
    title: 'Movies',
    url: '/favourite-movies',
    sheetId: '1q3LFzLYqK0tLWHjvHYxFE1IIF-FrOJuqJ6XBIQIEl6U',
  },
  {
    title: 'Restaurants',
    url: '/favourite-restaurants',
    sheetId: '1J1znKQxeNR3Y6Q1mEPzZyMfCAGK4FQyxasoCQx35NVQ',
  },
  {
    title: 'Tracks',
    url: '/favourite-tracks',
    sheetId: '1ifEAiSgIMKrtTJ6fSHNGmQ-kMzR_MyAa-PjvBWOsBRA',
  },
  {
    title: 'Articles',
    url: '/favourite-articles',
    sheetId: '1R928oTM4hiTFXZ6Ww9-2pMKLAWy2Wjf3Z9xrXC6GTa0',
  },
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
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  useEffect(() => {
    const fetchCounts = async () => {
      const results = await Promise.all(
        categories.map(async ({ title, sheetId }) => {
          const data = await fetchDataFromGoogleSheets(sheetId);
          const count = data && data.length > 1 ? data.length - 1 : null;
          return [title, count] as [string, number | null];
        }),
      );
      setCounts(Object.fromEntries(results));
    };

    fetchCounts();
  }, []);

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
                  <Image src="/icons/007-star.png" alt="" width={64} height={64} unoptimized />
                </StyledIcon>
                <p>{title}</p>
                <Count>{counts[title] != null ? `${counts[title]} entries` : '—'}</Count>
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
    margin: 20px auto;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    max-width: 1100px;
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
    padding: 0 10px;
    margin: 0;
    text-align: center;
    font-family: 'Oswald', sans-serif;
    letter-spacing: 2px;
  }
`;

const Count = styled.span`
  font-size: 0.85rem;
  opacity: 0.85;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 1px;
`;

const StyledIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
