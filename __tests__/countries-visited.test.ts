import { processData } from '../pages/countries-visited';

// Builds minimal raw data: a header row followed by the given data rows.
// Each row has 14 columns (7 continents × 2 columns each: country + visited).
const makeRawData = (rows: string[][]): string[][] => [Array(14).fill('header'), ...rows];

describe('processData', () => {
  it("maps 'Yes' to '✔' and any other value to an empty string", () => {
    const rawData = makeRawData([
      ['France', 'Yes', 'USA', 'No', '', '', '', '', '', '', '', '', '', ''],
    ]);
    const result = processData(rawData);
    expect(result['Europe'][0]).toEqual({ country: 'France', visited: '✔' });
    expect(result['North America'][0]).toEqual({ country: 'USA', visited: '' });
  });

  it('skips rows where the country column is empty', () => {
    const rawData = makeRawData([
      // Europe row 1: country present; North America row 1: country absent
      ['France', 'Yes', '', 'Yes', '', '', '', '', '', '', '', '', '', ''],
      // Europe row 2: country absent; North America row 2: country present
      ['', 'Yes', 'Canada', 'Yes', '', '', '', '', '', '', '', '', '', ''],
    ]);
    const result = processData(rawData);
    expect(result['Europe']).toHaveLength(1);
    expect(result['Europe'][0].country).toBe('France');
    expect(result['North America']).toHaveLength(1);
    expect(result['North America'][0].country).toBe('Canada');
  });
});
