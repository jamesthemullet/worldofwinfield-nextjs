import styled from '@emotion/styled';
import Link from 'next/link';
import type { JSX } from 'react';
import { colours } from '../pages/_app';

type RelatedSection = {
  label: string;
  href: string;
  colour: string;
};

type RelatedSectionsProps = {
  sections: RelatedSection[];
};

export default function RelatedSections({ sections }: RelatedSectionsProps): JSX.Element {
  return (
    <Wrapper aria-label="Explore more">
      <Heading>Explore more</Heading>
      <TileRow>
        {sections.map(({ label, href, colour }) => (
          <Tile key={href} href={href} colour={colour}>
            {label}
          </Tile>
        ))}
      </TileRow>
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  max-width: 1268px;
  margin: 4rem auto 2rem;
  padding: 0 1rem;
`;

const Heading = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${colours.dark};
`;

const TileRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Tile = styled(Link)<{ colour: string }>`
  display: inline-block;
  padding: 1rem 1.5rem;
  background-color: ${(props) => props.colour};
  color: ${colours.white};
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  min-width: 160px;
  text-align: center;

  &:hover {
    opacity: 0.85;
  }

  @media screen and (max-width: 768px) {
    flex: 1 1 calc(50% - 0.5rem);
    min-width: 0;
  }
`;
