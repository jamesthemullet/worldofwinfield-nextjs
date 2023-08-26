import Date from './date';
import CoverImage from './cover-image';
import PostTitle from './post-title';
import Link from 'next/link';
import { PostHeaderProps } from '../lib/types';
import styled from '@emotion/styled';
import { colours } from '../pages/_app';

export default function PostHeader({ title, coverImage, date, slug }: PostHeaderProps) {
  const aspectRatio = coverImage?.node.mediaDetails.width / coverImage?.node.mediaDetails.height;

  // Generate random color indexes
  const blockColours = [colours.dark, colours.pink, colours.green, colours.purple];
  const randomIndex1 = Math.floor(Math.random() * blockColours.length);
  let randomIndex2 = Math.floor(Math.random() * blockColours.length);

  // Ensure the second color is different from the first
  while (randomIndex2 === randomIndex1) {
    randomIndex2 = Math.floor(Math.random() * blockColours.length);
  }

  // Get the random colors
  const randomColour1 = blockColours[randomIndex1];
  const randomColour2 = blockColours[randomIndex2];

  return (
    <>
      <ImageContainer aspectRatio={aspectRatio}>
        <CoverImage title={title} coverImage={coverImage} />
      </ImageContainer>
      <StyledLink href={`/posts/${slug}`} aria-label={title}>
        <PostTitle backgroundColour={randomColour1}>{title}</PostTitle>
      </StyledLink>
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
  aspect-ratio: ${(props) => props.aspectRatio};
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
