import { blockColours, getColourFromTitle, getColoursFromTitle } from './block-colours';

jest.mock('../pages/_app', () => ({
  colours: {
    purple: '#8884FF',
    pink: '#D90368',
    burgandy: '#820263',
    dark: '#291720',
    green: '#04A777',
    white: '#FFFFFF',
    blueish: '#547AA5',
    azure: '#3185FC',
  },
}));

describe('getColourFromTitle', () => {
  it('returns a string that exists in blockColours', () => {
    const colour = getColourFromTitle('Hello World');
    expect(blockColours).toContain(colour);
  });

  it('is deterministic — same title always produces the same colour', () => {
    const title = 'My Consistent Blog Post Title';
    expect(getColourFromTitle(title)).toBe(getColourFromTitle(title));
  });
});

describe('getColoursFromTitle', () => {
  it('returns colour1 and colour2 that are both members of blockColours', () => {
    const { colour1, colour2 } = getColoursFromTitle('Test Title');
    expect(blockColours).toContain(colour1);
    expect(blockColours).toContain(colour2);
  });

  it('colour1 and colour2 are always distinct from each other', () => {
    const titles = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];
    for (const title of titles) {
      const { colour1, colour2 } = getColoursFromTitle(title);
      expect(colour1).not.toBe(colour2);
    }
  });
});
