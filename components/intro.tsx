import styled from '@emotion/styled';
import { colours } from '../pages/_app';

console.log(1, colours);

const blockColours = [colours.orange, colours.pink, colours.green];

export default function Intro() {
  return (
    <section>
      <HiddenHeading>World Of Winfield</HiddenHeading>
      <GridContainer>
        {Array.from('WORLD OFWINFIELD').map((letter, index) => (
          <Block key={index} color={blockColours[getColour(index)]}>
            <Letter>{letter}</Letter>
          </Block>
        ))}
      </GridContainer>
    </section>
  );
}

const HiddenHeading = styled.h1`
  position: absolute;
  top: -9999px;
  left: -9999px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 769px) {
    border: 5px solid ${colours.white};
  }
`;

const Block = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color};
  color: ${colours.white};

  @media (min-width: 769px) {
    border: 5px solid ${colours.white};
    aspect-ratio: 1/1;
  }
`;

const Letter = styled.p`
  font-size: 7rem;
  font-family: 'Luckiest Guy', monospace;
  padding: 0;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const getColour = (index) => {
  const colourIndex = index % Object.keys(blockColours).length;
  return Object.keys(blockColours)[colourIndex];
};
