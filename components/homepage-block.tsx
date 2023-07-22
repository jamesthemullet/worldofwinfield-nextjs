import styled from '@emotion/styled';
import { colours } from '../pages/_app';

const blockColours = [colours.orange, colours.pink, colours.green, colours.purple];

export default function HomepageBlock({ props }: any) {
  const randomIndex = Math.floor(Math.random() * blockColours.length);
  const randomColour = blockColours[randomIndex];

  return (
    <Block backgroundColour={randomColour} colour={colours.white}>
      <h3>{props}</h3>
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

  h3 {
    font-size: 4rem;
    transition: font-size 0.3s ease;

    &:hover {
      font-size: 5rem;
    }
  }

  &::before {
    content: '';
    display: block;
    padding-top: 100%;
    pointer-events: none;
  }
`;
