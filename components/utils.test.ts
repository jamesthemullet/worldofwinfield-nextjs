import { getMonthNumber, getMonthName } from './utils';

describe('getMonthNumber', () => {
  it.each([
    ['January', 1],
    ['February', 2],
    ['March', 3],
    ['April', 4],
    ['May', 5],
    ['June', 6],
    ['July', 7],
    ['August', 8],
    ['September', 9],
    ['October', 10],
    ['November', 11],
    ['December', 12],
  ])('returns %i for %s', (monthName, expected) => {
    expect(getMonthNumber(monthName)).toBe(expected);
  });

  it('returns 0 for an unrecognised month name', () => {
    expect(getMonthNumber('Octember')).toBe(0);
  });

  it('is case-sensitive and returns 0 for lowercase input', () => {
    expect(getMonthNumber('january')).toBe(0);
  });
});

describe('getMonthName', () => {
  it.each([
    [1, 'January'],
    [2, 'February'],
    [3, 'March'],
    [4, 'April'],
    [5, 'May'],
    [6, 'June'],
    [7, 'July'],
    [8, 'August'],
    [9, 'September'],
    [10, 'October'],
    [11, 'November'],
    [12, 'December'],
  ])('returns %s for month number %i', (monthNumber, expected) => {
    expect(getMonthName(monthNumber)).toBe(expected);
  });

  it('returns undefined for an out-of-range number', () => {
    expect(getMonthName(13)).toBeUndefined();
    expect(getMonthName(0)).toBeUndefined();
  });

  it('getMonthNumber and getMonthName are inverse operations', () => {
    for (let i = 1; i <= 12; i++) {
      expect(getMonthNumber(getMonthName(i))).toBe(i);
    }
  });
});
