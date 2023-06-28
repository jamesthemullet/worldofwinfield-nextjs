import { PostTitleProps } from '../lib/types';
import styled from '@emotion/styled';
import { colours } from '../pages/_app';

export default function PostTitle({ backgroundColour, children }: PostTitleProps) {
  return (
    <Title
      backgroundColour={backgroundColour}
      colour={colours.white}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}

const Title = styled.h1<{ backgroundColour: string; colour: string }>`
  font-size: 3rem;
  padding: 1rem;
  line-height: 3rem;
  font-weight: 700;
  margin: 0;
  box-sizing: border-box;
  background-color: ${(props) => props.backgroundColour};
  color: ${(props) => props.colour};
`;
