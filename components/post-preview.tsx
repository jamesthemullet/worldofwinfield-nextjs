import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { sanitize } from '../lib/sanitize';
import { PostPreviewProps } from '../lib/types';
import { colours } from '../pages/_app';
import DateComponent from './date';

const blockColours = [
  colours.pink,
  colours.green,
  colours.purple,
  colours.burgandy,
  colours.dark,
  colours.azure,
  colours.blueish,
];

const stripExternalLinks = (excerpt: string) => {
  const regex = /<a\s+(?:[^>]*?\s+)?href="https?:\/\/[^"]*"[^>]*>.*?<\/a>/g;
  return excerpt.replace(regex, '');
};

export default function PostPreview({
  title,
  date,
  excerpt,
  slug,
  featuredImage,
}: PostPreviewProps) {
  const sanitizedExcerpt = useMemo(() => sanitize(stripExternalLinks(excerpt)), [excerpt]);

  const fallbackColour = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = (hash * 31 + title.charCodeAt(i)) & 0xffffffff;
    }
    return blockColours[Math.abs(hash) % blockColours.length];
  }, [title]);

  return (
    <CardContainer>
      <ImageLink href={`/${slug}`} aria-label={title}>
        {featuredImage?.node.sourceUrl ? (
          <Image
            src={featuredImage.node.sourceUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            quality={75}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <ColourFallback colour={fallbackColour} />
        )}
      </ImageLink>
      <ContentSide>
        <TitleLink href={`/${slug}`}>
          <CardTitle>{title}</CardTitle>
        </TitleLink>
        <PostedDate>
          <DateComponent dateString={date} />
        </PostedDate>
        <CardExcerpt dangerouslySetInnerHTML={{ __html: sanitizedExcerpt }} />
        <ReadMoreLink href={`/${slug}`}>Read More</ReadMoreLink>
      </ContentSide>
    </CardContainer>
  );
}

const CardContainer = styled.article`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #ddd;
  padding-bottom: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
    align-items: flex-start;
  }
`;

const ImageLink = styled(Link)`
  position: relative;
  display: block;
  flex-shrink: 0;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #eee;

  @media (min-width: 768px) {
    width: 40%;
    aspect-ratio: 16 / 9;
  }
`;

const ColourFallback = styled.div<{ colour: string }>`
  position: absolute;
  inset: 0;
  background-color: ${(props) => props.colour};
`;

const ContentSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem 0;

  @media (min-width: 768px) {
    padding: 0;
  }
`;

const TitleLink = styled(Link)`
  text-decoration: none;
`;

const CardTitle = styled.h2`
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  line-height: 1.3;
  color: #000;

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const PostedDate = styled.p`
  font-family: 'Oswald', sans-serif;
  font-size: 0.875rem;
  color: #666;
  margin: 0 0 0.75rem;
`;

const ReadMoreLink = styled(Link)`
  align-self: flex-start;
  padding: 8px 20px;
  background-color: ${colours.pink};
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  text-decoration: none;

  &:hover {
    background-color: ${colours.dark};
  }
`;

const CardExcerpt = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 1.25rem;
  flex: 1;

  p {
    margin: 0;
    word-wrap: break-word;
  }
`;
