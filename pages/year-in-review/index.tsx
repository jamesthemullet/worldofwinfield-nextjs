import styled from '@emotion/styled';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import Container from '../../components/container';
import Layout from '../../components/layout';
import PostHeader from '../../components/post-header';
import type { YearInReviewIndexPageProps } from '../../lib/types';
import { colours } from '../_app';

const FIRST_YEAR = 2018;

export default function YearInReviewIndex({ years }: YearInReviewIndexPageProps) {
  const seo = {
    opengraphTitle: 'Year in Review - World Of Winfield',
    opengraphDescription: 'Annual retrospectives of everything written on World Of Winfield.',
    opengraphSiteName: 'World Of Winfield',
    opengraphImage: undefined,
  };

  return (
    <Layout preview={null} seo={seo} title="Year in Review">
      <Container>
        <PostHeader title="Year in Review" />
        <YearGrid>
          {years.map((year) => (
            <YearTile key={year} href={`/year-in-review/${year}`}>
              {year}
            </YearTile>
          ))}
        </YearGrid>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - FIRST_YEAR + 1 }, (_, i) => currentYear - i);

  return {
    props: { years },
    revalidate: 3600,
  };
};

const YearGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 2rem 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
`;

const YearTile = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colours.dark};
  color: ${colours.white};
  text-decoration: none;
  padding: 1.5rem 1rem;
  min-height: 100px;
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }
`;
