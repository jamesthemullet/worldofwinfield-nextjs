import Date from './date';
import CoverImage from './cover-image';
import PostTitle from './post-title';
import { PostHeaderProps } from '../lib/types';
import styled from '@emotion/styled';
import { colours } from '../pages/_app';

export default function PostHeader({ title, coverImage, date }: PostHeaderProps) {
  const aspectRatio = coverImage?.node.mediaDetails.width / coverImage?.node.mediaDetails.height;

  // Generate random color indexes
  const blockColours = [colours.orange, colours.pink, colours.green, colours.purple];
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
      <PostTitle backgroundColour={randomColour1}>{title}</PostTitle>
      <div>
        <PostedContainer backgroundColour={randomColour2} colour={colours.white}>
          Posted <Date dateString={date} />
        </PostedContainer>
      </div>
    </>
  );
}

const ImageContainer = styled.div<{ aspectRatio: number }>`
  position: relative;
  min-width: 100vw;
  aspect-ratio: ${(props) => props.aspectRatio};
`;

const PostedContainer = styled.div<{ backgroundColour: string; colour: string }>`
  font-size: 1rem;
  line-height: 1.25rem;
  padding: 1rem;
  background-color: ${(props) => props.backgroundColour};
  color: ${(props) => props.colour};
`;
