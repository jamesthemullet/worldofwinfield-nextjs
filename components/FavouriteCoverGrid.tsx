import styled from '@emotion/styled';
import Image from 'next/image';
import type { JSX } from 'react';
import { useState } from 'react';
import { colours } from '../pages/_app';

type Props = {
  headerRow: string[];
  rows: string[][];
  coverArtByTitle: Record<string, string | null>;
  indexRequired: boolean;
};

const placeholderColours = [
  colours.purple,
  colours.pink,
  colours.burgandy,
  colours.green,
  colours.blueish,
  colours.azure,
];

const placeholderColourFor = (title: string): string => {
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return placeholderColours[hash % placeholderColours.length];
};

const STOP_WORDS = new Set(['a', 'an', 'the']);

const initialsFor = (title: string): string => {
  const words = title.split(/\s+/).filter((word) => word && !STOP_WORDS.has(word.toLowerCase()));

  return (words.length > 0 ? words : title.split(/\s+/))
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
};

// covers.openlibrary.org and the WordPress image proxy both sometimes return an
// error (or a broken "not found" image) for a URL that Open Library reported as
// valid, so we can't trust coverUrl alone — a broken <img> reads worse than the
// placeholder, so fall back to it as soon as the browser fails to load the image.
function BookCover({ title, coverUrl }: { title: string; coverUrl?: string | null }): JSX.Element {
  const [hasErrored, setHasErrored] = useState(false);

  if (!coverUrl || hasErrored) {
    return (
      <Placeholder style={{ backgroundColor: placeholderColourFor(title || 'book') }}>
        {initialsFor(title || '?')}
      </Placeholder>
    );
  }

  return (
    <Image
      alt={`Cover of ${title}`}
      src={coverUrl}
      sizes="(max-width: 768px) 40vw, 200px"
      quality={75}
      fill
      style={{ objectFit: 'cover' }}
      onError={() => setHasErrored(true)}
    />
  );
}

function FavouriteCoverGrid({
  headerRow,
  rows,
  coverArtByTitle,
  indexRequired,
}: Props): JSX.Element {
  const titleIndex =
    headerRow.indexOf('Title') !== -1 ? headerRow.indexOf('Title') : headerRow.indexOf('Name');
  const authorIndex = headerRow.indexOf('Author');
  const scoreIndex = headerRow.indexOf('Score');

  return (
    <Grid>
      {rows.map((row, rowIndex) => {
        const title = row[titleIndex] || '';
        const author = authorIndex !== -1 ? row[authorIndex] : undefined;
        const score = scoreIndex !== -1 ? row[scoreIndex] : undefined;
        const coverUrl = coverArtByTitle[title];

        return (
          <Card key={`${title}-${rowIndex}`}>
            <CoverWrapper>
              {indexRequired && <RankBadge>{rowIndex + 1}</RankBadge>}
              <BookCover title={title} coverUrl={coverUrl} />
            </CoverWrapper>
            <CardBody>
              <CardTitle>{title}</CardTitle>
              {author && <CardAuthor>{author}</CardAuthor>}
              {score && <CardScore>{score}</CardScore>}
            </CardBody>
          </Card>
        );
      })}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1.5rem 1rem;
  margin: 1rem 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
`;

const CoverWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
`;

const RankBadge = styled.span`
  position: absolute;
  top: 6px;
  left: 6px;
  z-index: 1;
  min-width: 1.5rem;
  padding: 0.15rem 0.4rem;
  border-radius: 999px;
  background-color: ${colours.dark};
  color: ${colours.white};
  font-size: 0.75rem;
  font-weight: bold;
  text-align: center;
`;

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: ${colours.white};
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.05em;
`;

const CardBody = styled.div`
  margin-top: 0.5rem;
`;

const CardTitle = styled.p`
  margin: 0;
  font-size: 0.85rem;
  font-weight: bold;
  line-height: 1.2;
`;

const CardAuthor = styled.p`
  margin: 0.15rem 0 0;
  font-size: 0.75rem;
  opacity: 0.8;
`;

const CardScore = styled.p`
  margin: 0.15rem 0 0;
  font-size: 0.75rem;
  opacity: 0.8;
`;

export default FavouriteCoverGrid;
