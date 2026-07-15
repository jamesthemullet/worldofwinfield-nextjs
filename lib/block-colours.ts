import { colours } from '../pages/_app';

export const blockColours = [
  colours.pink,
  colours.green,
  colours.purple,
  colours.burgandy,
  colours.dark,
  colours.azure,
  colours.blueish,
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return hash;
}

export function getColourFromTitle(title: string): string {
  return blockColours[Math.abs(hashString(title)) % blockColours.length];
}

export function getColoursFromTitle(title: string): { colour1: string; colour2: string } {
  const hash = hashString(title);
  const index1 = Math.abs(hash) % blockColours.length;
  const index2 = (index1 + 1 + (Math.abs(hash >> 4) % (blockColours.length - 1))) % blockColours.length;
  return { colour1: blockColours[index1], colour2: blockColours[index2] };
}
