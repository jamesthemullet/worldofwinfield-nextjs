import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import Container from '../components/container';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';
import PostTitle from '../components/post-title';
import ShareBar from '../components/share-bar';
import WorldMap from '../components/world-map';
import { fetchDataFromGoogleSheets as fetchSheetById } from '../lib/sheets';

const WISH_LIST_SHEET_ID = '1GX6KF20f3Nrb3m8T9th7UIV_uuePj4Ivlc_yLgo-4Bo';

// Pulls the "Country" column out of the holiday wish list sheet, which is
// shaped differently to the continents sheet (one row per place, not
// paired continent columns).
export const extractWishListCountries = (rawData: string[][] | null): string[] => {
  if (!rawData || rawData.length < 2) return [];

  const [headerRow, ...rows] = rawData;
  const countryIndex = headerRow.findIndex((header) => header?.trim().toLowerCase() === 'country');
  if (countryIndex === -1) return [];

  return rows.map((row) => row[countryIndex]).filter((country): country is string => !!country);
};

export const processData = (
  rawData: string[][],
): Record<string, { country: string; visited: string }[]> => {
  const continents = [
    'Europe',
    'North America',
    'Central America',
    'South America',
    'Africa',
    'Asia',
    'Oceania',
  ];
  const result: Record<string, { country: string; visited: string }[]> = {};

  continents.forEach((continent) => {
    result[continent] = [];
  });

  let columnIndex = 0;
  continents.forEach((continent) => {
    const continentCountries = [];
    for (let i = 1; i < rawData.length; i++) {
      const country = rawData[i][columnIndex];
      const visited = rawData[i][columnIndex + 1];

      if (country) {
        continentCountries.push({
          country,
          visited: visited === 'Yes' ? '✔' : '',
        });
      }
    }
    result[continent] = continentCountries;
    columnIndex += 2;
  });

  return result;
};

const fetchDataFromGoogleSheets = async (): Promise<string[][] | null> => {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
    const sheetID = '1OBRmcLtmwbb8AjoUj8F9wUe5j7AERFlI-iG2iYkA3Jg';
    const SHEET_NAME = 'Sheet1';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${SHEET_NAME}?alt=json&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    return data.values;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return null;
  }
};

const CountryList = ({
  transformedData,
}: {
  transformedData: {
    [key: string]: { country: string; visited: string }[];
  };
}) => {
  return (
    <ContentContainer>
      {Object.keys(transformedData).map((continent) => (
        <div key={continent}>
          <h2>{continent}</h2>
          <ul>
            {transformedData[continent].map((item, index) => (
              <li key={index}>
                {item.country} {item.visited}
              </li>
            ))}
          </ul>
          <p>
            Total Countries Visited in {continent}:{' '}
            {transformedData[continent].filter((item) => item.visited).length} out of{' '}
            {transformedData[continent].length}
          </p>
        </div>
      ))}
    </ContentContainer>
  );
};

export default function CountriesVisited({
  transformedData,
  wishListCountries,
}: {
  transformedData: {
    [key: string]: { country: string; visited: string }[];
  };
  wishListCountries: string[];
}) {
  const router = useRouter();

  const allCountries = Object.values(transformedData).flat();
  const totalVisited = allCountries.filter((item) => item.visited).length;
  const totalCountries = allCountries.length;
  const continentsExplored = Object.values(transformedData).filter((countries) =>
    countries.some((item) => item.visited),
  ).length;
  const totalContinents = Object.keys(transformedData).length;
  const visitedCountries = allCountries.filter((item) => item.visited).map((item) => item.country);

  const seo = {
    opengraphTitle: 'Countries Visited | World Of Winfield',
    opengraphDescription: `I've visited ${totalVisited} of ${totalCountries} countries across ${continentsExplored} continents.`,
    opengraphSiteName: 'World Of Winfield',
  };

  return (
    <Layout preview={null} title="Countries Visited" seo={seo}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <PostContainer>
              <StyledPostHeader>
                <PostHeader title={'Countries Visited'} />
              </StyledPostHeader>
              <StatBlock>
                <StatItem>
                  <StatNumber>
                    {totalVisited} / {totalCountries}
                  </StatNumber>
                  <StatLabel>countries visited</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>
                    {continentsExplored} / {totalContinents}
                  </StatNumber>
                  <StatLabel>continents explored</StatLabel>
                </StatItem>
              </StatBlock>
              <WorldMap visitedCountries={visitedCountries} wishListCountries={wishListCountries} />
              <ShareBar
                title={`I've visited ${totalVisited} of ${totalCountries} countries across ${continentsExplored} continents! 🌍`}
                url="https://worldofwinfield.co.uk/countries-visited"
              />
              <CountryList transformedData={transformedData} />
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

    @media (min-width: 1281px) {
      max-width: 800px;
      margin: 0 auto;
    }
  }
`;

const StyledPostHeader = styled.div`
  margin: 0 auto;
`;

const StatBlock = styled.div`
  display: flex;
  gap: 2rem;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  max-width: 800px;
  background: #f5f5f5;
  border-left: 4px solid #000;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatNumber = styled.span`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.25rem;
`;

const ContentContainer = styled.section`
  margin: 0 auto;
  padding: 2rem;
  max-width: 800px;

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: none;
    padding-left: 0;
  }
`;

export async function getStaticProps() {
  const [rawData, wishListRawData] = await Promise.all([
    fetchDataFromGoogleSheets(),
    fetchSheetById(WISH_LIST_SHEET_ID),
  ]);
  const transformedData = rawData ? processData(rawData) : {};
  const wishListCountries = extractWishListCountries(wishListRawData);

  return {
    props: {
      transformedData,
      wishListCountries,
    },
    revalidate: 86400,
  };
}
