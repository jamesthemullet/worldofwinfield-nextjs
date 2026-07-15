import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { blockColours } from '../lib/block-colours';
import { colours } from '../pages/_app';

export default function SectionSeparator(): JSX.Element {
  const [backgroundColour, setBackgroundColour] = useState(blockColours[0]);

  useEffect(() => {
    setBackgroundColour(blockColours[Math.floor(Math.random() * blockColours.length)]);
  }, []);

  return <StyledHr backgroundColour={backgroundColour} colour={colours.white} />;
}

const StyledHr = styled.hr<{ backgroundColour: string; colour: string }>`
  background-color: ${(props) => props.backgroundColour};
  color: ${(props) => props.colour};
  height: 5px;
  border: none;
  margin: 0;
`;
