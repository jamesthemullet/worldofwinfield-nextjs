import { useRouter } from 'next/router';
import Container from '../components/container';
import PostHeader from '../components/post-header';
import Layout from '../components/layout';
import PostTitle from '../components/post-title';
import styled from '@emotion/styled';
import axios from 'axios';

const processData = (rawData) => {
  const continents = [
    'Europe',
    'North America',
    'Central America',
    'South America',
    'Africa',
    'Asia',
    'Oceania',
  ];
  const result = {};

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

const fetchDataFromGoogleSheets = async () => {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
    const sheetID = '1OBRmcLtmwbb8AjoUj8F9wUe5j7AERFlI-iG2iYkA3Jg';
    const SHEET_NAME = 'Sheet1';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${SHEET_NAME}?alt=json&key=${API_KEY}`;

    const response = await axios.get(url);
    return response.data.values;
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
}: {
  transformedData: {
    [key: string]: { country: string; visited: string }[];
  };
}) {
  const router = useRouter();

  return (
    <Layout preview={null} title="Countries Visited">
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <PostContainer>
              <StyledPostHeader>
                <PostHeader title={'Countries Visited'} />
              </StyledPostHeader>
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

export async function getServerSideProps() {
  const rawData = await fetchDataFromGoogleSheets();
  const transformedData = processData(rawData);

  return {
    props: {
      transformedData,
    },
  };
}
