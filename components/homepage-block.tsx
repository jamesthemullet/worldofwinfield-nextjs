import styled from '@emotion/styled';
import { colours } from '../pages/_app';

type HomePageBLockTypes = {
  props: string;
};

const blockColours = [colours.pink, colours.green, colours.purple, colours.dark];

export default function HomepageBlock({ props }: HomePageBLockTypes) {
  const randomIndex = Math.floor(Math.random() * blockColours.length);
  const randomColour = blockColours[randomIndex];

  return (
    <Block backgroundColour={randomColour} colour={colours.white}>
      <a>{props}</a>
    </Block>
  );
}

const Block = styled.div<{ backgroundColour: string; colour: string }>`
  background-color: ${(props) => props.backgroundColour};
  color: ${(props) => props.colour};
  width: calc(50% - 5px);
  aspect-ratio: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 768px) {
    width: calc(100%);
    aspect-ratio: 2/1;
  }

  a {
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
