import styled from '@emotion/styled';
import type { JSX } from 'react';
import { blockColours } from '../lib/block-colours';
import { colours } from '../pages/_app';

export default function SectionSeparator(): JSX.Element {
  const backgroundColour = blockColours[Math.floor(Math.random() * blockColours.length)];
  return (
    <StyledHr backgroundColour={backgroundColour} colour={colours.white} suppressHydrationWarning />
  );
}

const StyledHr = styled.hr<{ backgroundColour: string; colour: string }>`
  background-color: ${(props) => props.backgroundColour};
  color: ${(props) => props.colour};
  height: 5px;
  border: none;
  margin: 0;
`;
