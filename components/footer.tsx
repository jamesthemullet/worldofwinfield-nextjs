import Container from './container';
import { colours } from '../pages/_app';
import styled from '@emotion/styled';
import ArchiveDropdown from './archive';

export default function Footer() {
  return (
    <footer>
      <Container>
        <Block backgroundColour={colours.dark} colour={colours.white}>
          <ArchiveDropdown />
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
  display: flex;
  flex-direction: row;
  gap: 40px;
  justify-content: center;
  font-family: 'Oswald';

  @media screen and (max-width: 768px) {
    gap: 20px;
  }

  p {
    letter-spacing: 3px;
    margin: 0;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;
