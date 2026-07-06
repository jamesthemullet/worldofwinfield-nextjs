import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { colours } from '../pages/_app';

const blockColours = [
  colours.pink,
  colours.green,
  colours.purple,
  colours.burgandy,
  colours.dark,
  colours.azure,
  colours.blueish,
];

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
