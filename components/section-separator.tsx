import styled from '@emotion/styled';
import { colours } from '../pages/_app';

const blockColours = [colours.orange, colours.pink, colours.green, colours.purple];
const randomIndex1 = Math.floor(Math.random() * blockColours.length);
const randomColour1 = blockColours[randomIndex1];

export default function SectionSeparator() {
  return <StyledHr backgroundColour={randomColour1} colour={colours.white} />;
}

const StyledHr = styled.hr<{ backgroundColour: string; colour: string }>`
  background-color: ${(props) => props.backgroundColour};
  color: ${(props) => props.colour};
  height: 5px;
  border: none;
  margin: 0;
`;
