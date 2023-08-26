import styled from '@emotion/styled';
import { colours } from '../pages/_app';
import Link from 'next/link';

type HomePageBlockTypes = {
  title: string;
  url: string;
};

const blockColours = [colours.pink, colours.green, colours.purple, colours.dark];

export default function HomepageBlock({ url, title }: HomePageBlockTypes) {
  const randomIndex = Math.floor(Math.random() * blockColours.length);
  const randomColour = blockColours[randomIndex];

  return url ? (
    <StyledLink href={url}>
      <Block backgroundColour={randomColour} colour={colours.white}>
        <p>{title}</p>
      </Block>
    </StyledLink>
  ) : (
    <Block backgroundColour={randomColour} colour={colours.white}>
      <p>{title}</p>
    </Block>
  );
}

const StyledLink = styled(Link)`
  text-decoration: none;
  width: calc(50% - 5px);
  aspect-ratio: 1;
  position: relative;
`;

const Block = styled.div<{ backgroundColour: string; colour: string }>`
  background-color: ${(props) => props.backgroundColour};
  color: ${(props) => props.colour};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;

  @media (max-width: 768px) {
    width: calc(100%);
    aspect-ratio: 2/1;
  }

  p {
    font-size: 5rem;
    transition: font-size 0.3s ease;
    font-weight: 700;

    &:hover {
      font-size: 6rem;
    }
  }

  &::before {
    content: '';
    display: block;
    padding-top: 100%;
    pointer-events: none;
  }
`;
