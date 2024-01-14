import Container from './container';
import { colours } from '../pages/_app';
import styled from '@emotion/styled';
import ArchiveDropdown from './archive';

export default function Footer() {
  return (
    <footer>
      <Container>
        <Block backgroundColour={colours.dark} colour={colours.white}>
          <FlexRow>
            <ArchiveDropdown />
            <p>World Of Winfield</p>
          </FlexRow>
          <IconAttribution>
            Icons made by{' '}
            <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">
              Smashicons
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </IconAttribution>
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
  flex-direction: column;
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

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
  justify-content: center;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const IconAttribution = styled.div`
  font-size: 0.8rem;

  a {
    text-decoration: none;
    color: ${colours.white};
  }
`;
