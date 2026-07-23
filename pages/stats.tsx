import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Container from '../components/container';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import PostTitle from '../components/post-title';
import { getTotalPostCount } from '../lib/api';
import { fetchDataFromGoogleSheets } from '../lib/sheets';

const SHEET_IDS = {
  countriesVisited: '1OBRmcLtmwbb8AjoUj8F9wUe5j7AERFlI-iG2iYkA3Jg',
  books: '1G-QrN1NDpKAr12VyIi50Nod8_g-YOSGP3bovCXxDHlY',
  beers: '1pNNIw849xWrQHtDptwInGs6Un0AZh-fgXUssC3XIrHM',
  movies: '1q3LFzLYqK0tLWHjvHYxFE1IIF-FrOJuqJ6XBIQIEl6U',
  djs: '1_zpDBFlpW2ZWTVsXQHoW6Y4FbGw8Vi53nMYpZiOypbg',
  cheese: '1UDjT7_Q5rBPQasn4o2qxUOsEcElEI67nl-ep9YTLc-E',
  restaurants: '1J1znKQxeNR3Y6Q1mEPzZyMfCAGK4FQyxasoCQx35NVQ',
  tracks: '1ifEAiSgIMKrtTJ6fSHNGmQ-kMzR_MyAa-PjvBWOsBRA',
  articles: '1R928oTM4hiTFXZ6Ww9-2pMKLAWy2Wjf3Z9xrXC6GTa0',
  cities: '1WBfOTfhC70AygxrTcIIgvigzlvOD65WfI9Ysrd3aF5o',
  favouriteCountries: '1zyzuLzWY0S6mUp-FVjcIa3QFAENcU94WVD9ZF0JWERY',
};

const countRows = (data: string[][] | null): number => {
  if (!data || data.length <= 1) return 0;
  return data.length - 1;
};

const parseCountriesData = (
  data: string[][] | null,
): { visited: number; total: number; continents: number } => {
  if (!data) return { visited: 0, total: 0, continents: 0 };
  const CONTINENT_COUNT = 7;
  let visited = 0;
  let total = 0;
  const continentsVisited = new Set<number>();

  for (let i = 1; i < data.length; i++) {
    for (let col = 0; col < CONTINENT_COUNT; col++) {
      const country = data[i]?.[col * 2];
      const isVisited = data[i]?.[col * 2 + 1] === 'Yes';
      if (country) {
        total++;
        if (isVisited) {
          visited++;
          continentsVisited.add(col);
        }
      }
    }
  }

  return { visited, total, continents: continentsVisited.size };
};

type StatsProps = {
  countriesVisited: number;
  totalCountries: number;
  continentsVisited: number;
  books: number;
  beers: number;
  movies: number;
  djs: number;
  cheese: number;
  restaurants: number;
  tracks: number;
  articles: number;
  cities: number;
  favouriteCountries: number;
  totalPosts: number;
};

export default function Stats({
  countriesVisited,
  totalCountries,
  continentsVisited,
  books,
  beers,
  movies,
  djs,
  cheese,
  restaurants,
  tracks,
  articles,
  cities,
  favouriteCountries,
  totalPosts,
}: StatsProps) {
  const router = useRouter();
  const yearsActive = new Date().getFullYear() - 2017;
  const worldPercent =
    totalCountries > 0 ? Math.round((countriesVisited / totalCountries) * 100) : 0;

  const seo = {
    opengraphTitle: 'James Stats | World Of Winfield',
    opengraphDescription: `${countriesVisited} countries visited, ${totalPosts}+ blog posts, and much more.`,
    opengraphSiteName: 'World Of Winfield',
  };

  return (
    <Layout preview={null} title="James Stats" seo={seo}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <PostContainer>
            <PostHeader title="James Stats" />
            <Intro>A snapshot of everything tracked on this site.</Intro>

            <Section>
              <SectionTitle>Travel</SectionTitle>
              <Grid>
                <StatCard href="/countries-visited">
                  <StatNumber>
                    {countriesVisited}
                    <StatDenominator> / {totalCountries}</StatDenominator>
                  </StatNumber>
                  <StatLabel>countries visited</StatLabel>
                  <StatSub>{worldPercent}% of the world</StatSub>
                </StatCard>
                <StatCard href="/countries-visited">
                  <StatNumber>
                    {continentsVisited}
                    <StatDenominator> / 7</StatDenominator>
                  </StatNumber>
                  <StatLabel>continents explored</StatLabel>
                </StatCard>
                <StatCard href="/favourite-countries">
                  <StatNumber>{favouriteCountries}</StatNumber>
                  <StatLabel>favourite countries</StatLabel>
                </StatCard>
                <StatCard href="/favourite-cities">
                  <StatNumber>{cities}</StatNumber>
                  <StatLabel>cities visited</StatLabel>
                </StatCard>
              </Grid>
            </Section>

            <Section>
              <SectionTitle>The Blog</SectionTitle>
              <Grid>
                <StatCard href="/blog">
                  <StatNumber>{totalPosts > 0 ? `${totalPosts}+` : '—'}</StatNumber>
                  <StatLabel>posts published</StatLabel>
                </StatCard>
                <StatCard href="/blog">
                  <StatNumber>{yearsActive}</StatNumber>
                  <StatLabel>years writing</StatLabel>
                  <StatSub>since 2017</StatSub>
                </StatCard>
              </Grid>
            </Section>

            <Section>
              <SectionTitle>Reading & Culture</SectionTitle>
              <Grid>
                <StatCard href="/favourite-books">
                  <StatNumber>{books}</StatNumber>
                  <StatLabel>favourite books</StatLabel>
                </StatCard>
                <StatCard href="/favourite-movies">
                  <StatNumber>{movies}</StatNumber>
                  <StatLabel>favourite movies</StatLabel>
                </StatCard>
                <StatCard href="/favourite-articles">
                  <StatNumber>{articles}</StatNumber>
                  <StatLabel>favourite articles</StatLabel>
                </StatCard>
              </Grid>
            </Section>

            <Section>
              <SectionTitle>Food & Drink</SectionTitle>
              <Grid>
                <StatCard href="/favourite-beers">
                  <StatNumber>{beers}</StatNumber>
                  <StatLabel>beers rated</StatLabel>
                </StatCard>
                <StatCard href="/favourite-restaurants">
                  <StatNumber>{restaurants}</StatNumber>
                  <StatLabel>restaurants reviewed</StatLabel>
                </StatCard>
                <StatCard href="/favourite-cheese">
                  <StatNumber>{cheese}</StatNumber>
                  <StatLabel>cheeses listed</StatLabel>
                </StatCard>
              </Grid>
            </Section>

            <Section>
              <SectionTitle>Music</SectionTitle>
              <Grid>
                <StatCard href="/favourite-tracks">
                  <StatNumber>{tracks}</StatNumber>
                  <StatLabel>favourite tracks</StatLabel>
                </StatCard>
                <StatCard href="/favourite-djs">
                  <StatNumber>{djs}</StatNumber>
                  <StatLabel>favourite DJs</StatLabel>
                </StatCard>
              </Grid>
            </Section>
          </PostContainer>
        )}
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  const [
    countriesData,
    booksData,
    beersData,
    moviesData,
    djsData,
    cheeseData,
    restaurantsData,
    tracksData,
    articlesData,
    citiesData,
    favouriteCountriesData,
    totalPosts,
  ] = await Promise.all([
    fetchDataFromGoogleSheets(SHEET_IDS.countriesVisited),
    fetchDataFromGoogleSheets(SHEET_IDS.books),
    fetchDataFromGoogleSheets(SHEET_IDS.beers),
    fetchDataFromGoogleSheets(SHEET_IDS.movies),
    fetchDataFromGoogleSheets(SHEET_IDS.djs),
    fetchDataFromGoogleSheets(SHEET_IDS.cheese),
    fetchDataFromGoogleSheets(SHEET_IDS.restaurants),
    fetchDataFromGoogleSheets(SHEET_IDS.tracks),
    fetchDataFromGoogleSheets(SHEET_IDS.articles),
    fetchDataFromGoogleSheets(SHEET_IDS.cities),
    fetchDataFromGoogleSheets(SHEET_IDS.favouriteCountries),
    getTotalPostCount(),
  ]);

  const { visited, total, continents } = parseCountriesData(countriesData);

  return {
    props: {
      countriesVisited: visited,
      totalCountries: total,
      continentsVisited: continents,
      books: countRows(booksData),
      beers: countRows(beersData),
      movies: countRows(moviesData),
      djs: countRows(djsData),
      cheese: countRows(cheeseData),
      restaurants: countRows(restaurantsData),
      tracks: countRows(tracksData),
      articles: countRows(articlesData),
      cities: countRows(citiesData),
      favouriteCountries: countRows(favouriteCountriesData),
      totalPosts,
    },
    revalidate: 86400,
  };
}

const PostContainer = styled.article`
  max-width: 900px;
  margin: 0 auto;

  h1 {
    font-size: 3rem;
    line-height: 4rem;
  }
`;

const Intro = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 3rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 2px solid #000;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
`;

const StatCard = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
  background: #f5f5f5;
  border-left: 4px solid #000;
  padding: 1.25rem 1.5rem;
  transition: background 0.15s;

  &:hover {
    background: #e8e8e8;
  }

  &:focus-visible {
    outline: 2px solid #000;
    outline-offset: 2px;
  }
`;

const StatNumber = styled.span`
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
`;

const StatDenominator = styled.span`
  font-size: 1.5rem;
  font-weight: 400;
  color: #666;
`;

const StatLabel = styled.span`
  display: block;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.4rem;
`;

const StatSub = styled.span`
  display: block;
  font-size: 0.8rem;
  color: #777;
  margin-top: 0.2rem;
`;
