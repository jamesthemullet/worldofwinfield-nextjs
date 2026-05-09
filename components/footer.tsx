import styled from '@emotion/styled';
import { colours } from '../pages/_app';
import ArchiveDropdown from './archive';
import Container from './container';

export default function Footer() {
  return (
    <footer>
      <Container>
        <Block backgroundColour={colours.dark} colour={colours.white}>
          <FlexRow>
            <ArchiveDropdown />
            <p>World Of Winfield</p>
            <RssLink href="/api/feed">Subscribe via RSS</RssLink>
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

const RssLink = styled.a`
  color: ${colours.white};
  text-decoration: none;
  font-size: 1rem;
  letter-spacing: 1px;
  align-self: center;

  &:hover {
    text-decoration: underline;
  }
`;

const IconAttribution = styled.div`
  font-size: 0.8rem;

  a {
    text-decoration: none;
    color: ${colours.white};
  }
`;
