import Date from './date';
import CoverImage from './cover-image';
import PostTitle from './post-title';
import Link from 'next/link';
import { PostHeaderProps } from '../lib/types';
import styled from '@emotion/styled';
import { colours } from '../pages/_app';
import { sanitize } from '../lib/sanitize';
import { useMemo } from 'react';

export default function PostHeader({
  title,
  imageSize,
  coverImage,
  date,
  slug,
  heroPost,
  caption,
}: PostHeaderProps) {
  const aspectRatio =
    (coverImage?.node.mediaDetails.width ?? 0) / (coverImage?.node.mediaDetails.height ?? 1);

  const blockColours = [
    colours.pink,
    colours.green,
    colours.purple,
    colours.burgandy,
    colours.dark,
    colours.azure,
    colours.blueish,
  ];

  const { randomColour1, randomColour2 } = useMemo(() => {
    let hash = 0;
    const seed = title ?? '';
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
    }
    const index1 = Math.abs(hash) % blockColours.length;
    const index2 =
      (index1 + 1 + (Math.abs(hash >> 4) % (blockColours.length - 1))) % blockColours.length;
    return { randomColour1: blockColours[index1], randomColour2: blockColours[index2] };
  }, [title]);

  return (
    <>
      {coverImage && (
        <ImageContainer aspectRatio={aspectRatio}>
          <CoverImage
            title={title}
            coverImage={coverImage}
            imageSize={imageSize}
            heroPost={heroPost}
          />
          {caption && (
            <CaptionOverlay
              dangerouslySetInnerHTML={{ __html: sanitize(caption) }}></CaptionOverlay>
          )}
        </ImageContainer>
      )}
      {slug ? (
        <StyledLink href={`/${slug}`} aria-label={title}>
          <PostTitle backgroundColour={randomColour1}>{title}</PostTitle>
        </StyledLink>
      ) : (
        <PostTitle backgroundColour={randomColour1}>{title}</PostTitle>
      )}
      <div>
        <PostedContainer backgroundColour={randomColour2} colour={colours.white}>
          {date && (
            <p>
              Posted <Date dateString={date} />
            </p>
          )}
        </PostedContainer>
      </div>
    </>
  );
}

const ImageContainer = styled.div<{ aspectRatio: number }>`
  position: relative;
  min-width: 100%;
  aspect-ratio: ${(props) => props.aspectRatio || '16/9'};
  min-height: 200px;

  img {
    display: block;
  }
`;

const PostedContainer = styled.div<{ backgroundColour: string; colour: string }>`
  font-size: 1rem;
  line-height: 1.25rem;
  padding: 1rem;
  background-color: ${(props) => props.backgroundColour};
  color: ${(props) => props.colour};
  font-family: 'Oswald', sans-serif;

  @media (min-width: 1281px) {
    font-size: 1.5rem;
    padding: 1rem 5rem;
    line-height: 2rem;
  }

  p {
    margin: 0;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const CaptionOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 0.9rem;
  font-family: 'Oswald', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    color: white;
  }

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;
