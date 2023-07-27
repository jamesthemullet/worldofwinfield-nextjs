import Container from './container';
import { colours } from '../pages/_app';
import styled from '@emotion/styled';
import ArchiveDropdown from './archive';

export default function Footer() {
  const blockColours = [colours.orange, colours.pink, colours.green, colours.purple];
  const randomIndex1 = Math.floor(Math.random() * blockColours.length);
  const randomColour1 = blockColours[randomIndex1];
  return (
    <footer>
      <Container>
        <Block backgroundColour={randomColour1} colour={colours.white}>
          <p>World Of Winfield</p>
          <ArchiveDropdown />
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
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  p {
    letter-spacing: 3px;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;
