import { blockColours, getColourFromTitle, getColoursFromTitle } from './block-colours';

jest.mock('../pages/_app', () => ({
  colours: {
    dark: '#291720',
    white: '#FFFFFF',
    pink: '#D90368',
    purple: '#8884FF',
    burgandy: '#820263',
    green: '#04A777',
    blueish: '#547AA5',
    azure: '#3185FC',
  },
}));

describe('getColourFromTitle', () => {
  it('returns a colour from the blockColours palette', () => {
    const result = getColourFromTitle('Some Title');
    expect(blockColours).toContain(result);
  });

  it('is deterministic — same title always returns the same colour', () => {
    const title = 'Repeatable Title';
    expect(getColourFromTitle(title)).toBe(getColourFromTitle(title));
  });
});

describe('getColoursFromTitle', () => {
  it('returns two colours both within the blockColours palette', () => {
    const { colour1, colour2 } = getColoursFromTitle('Another Title');
    expect(blockColours).toContain(colour1);
    expect(blockColours).toContain(colour2);
  });

  it('returns two distinct colours', () => {
    const { colour1, colour2 } = getColoursFromTitle('Another Title');
    expect(colour1).not.toBe(colour2);
  });

  it('is deterministic — same title always returns the same pair', () => {
    const title = 'Stable Title';
    const first = getColoursFromTitle(title);
    const second = getColoursFromTitle(title);
    expect(first).toEqual(second);
  });
});
