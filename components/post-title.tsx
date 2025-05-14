import { PostTitleProps } from '../lib/types';
import styled from '@emotion/styled';
import { colours } from '../pages/_app';

export default function PostTitle({ backgroundColour, children }: PostTitleProps) {
  return (
    <StyledTitleContainer backgroundColour={backgroundColour}>
      <Title colour={colours.white} dangerouslySetInnerHTML={{ __html: children }} />
    </StyledTitleContainer>
  );
}

const StyledTitleContainer = styled.div<{ backgroundColour: string }>`
  background-color: ${(props) => props.backgroundColour};
  padding: 1rem;
  margin: 0;
  box-sizing: border-box;
  width: 100%;
`;

const Title = styled.h1<{ colour: string }>`
  font-size: 3rem;
  line-height: 4rem;
  font-weight: 700;
  margin: 0;
  box-sizing: border-box;
  color: ${(props) => props.colour};
  font-family: 'Oswald', sans-serif;
  letter-spacing: 2px;

  @media (min-width: 1281px) {
    font-size: 5rem;
    line-height: 7rem;
  }
`;
