import Container from './container';
import { colours } from '../pages/_app';
import styled from '@emotion/styled';

export default function Footer() {
  const blockColours = [colours.orange, colours.pink, colours.green, colours.purple];
  const randomIndex1 = Math.floor(Math.random() * blockColours.length);
  const randomColour1 = blockColours[randomIndex1];
  return (
    <footer>
      <Container>
        <Block backgroundColour={randomColour1} colour={colours.white}>
          <p>World Of Winfield</p>
        </Block>
      </Container>
    </footer>
  );
}

const Block = styled.div<{ backgroundColour: string; colour: string }>`
  background-color: ${(props) => props.backgroundColour};
  color: ${(props) => props.colour};
  padding: 1rem;
  margin: 0;
  color: ${colours.white};
  text-align: center;
  font-size: 1.5rem;
  font-family: 'Luckiest Guy', monospace;

  p {
    letter-spacing: 3px;
  }
`;
