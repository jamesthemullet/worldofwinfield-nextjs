import {
  getChange,
  normalisePrices,
  normaliseSymbolAlias,
  sortByPercentChange,
} from '../pages/stocks';

describe('normaliseSymbolAlias', () => {
  it('normalises exchange aliases to canonical form and strips trailing dots', () => {
    expect(normaliseSymbolAlias('LSE:GAW')).toBe('XLON:GAW');
    expect(normaliseSymbolAlias('XLON:TW.')).toBe('XLON:TW');
    expect(normaliseSymbolAlias('NYSE:NVO')).toBe('XNYS:NVO');
    expect(normaliseSymbolAlias('NASDAQ:RYAAY')).toBe('XNAS:RYAAY');
    expect(normaliseSymbolAlias('XETRA:PCFP')).toBe('XETR:PCFP');
    expect(normaliseSymbolAlias(' xlon:gaw ')).toBe('XLON:GAW');
  });

  it('returns trimmed uppercase input unchanged for unknown exchanges', () => {
    expect(normaliseSymbolAlias('UNKNOWN:XYZ')).toBe('UNKNOWN:XYZ');
    expect(normaliseSymbolAlias('NOSEPARATOR')).toBe('NOSEPARATOR');
  });
});

describe('normalisePrices', () => {
  it('returns an empty array for null or non-object input', () => {
    expect(normalisePrices(null)).toEqual([]);
    expect(normalisePrices('not an object')).toEqual([]);
    expect(normalisePrices(42)).toEqual([]);
  });

  it('converts numeric and string prices to numbers and sets error rows to null', () => {
    const input = {
      'XLON:GAW': { price: 150.5, previousClose: 148 },
      'LSE:FORT': { price: '200', previousClose: '195' },
      'XLON:EVR': { price: 50, error: 'delisted' },
    };
    const rows = normalisePrices(input);

    const gaw = rows.find((r) => r.symbol === 'XLON:GAW');
    expect(gaw?.price).toBe(150.5);
    expect(gaw?.previousClose).toBe(148);
    expect(gaw?.companyName).toBe('Games Workshop Group PLC');

    const fort = rows.find((r) => r.symbol === 'XLON:FORT');
    expect(fort?.price).toBe(200);
    expect(fort?.previousClose).toBe(195);

    const evr = rows.find((r) => r.symbol === 'XLON:EVR');
    expect(evr?.price).toBeNull();
  });
});

describe('getChange', () => {
  it('returns null change and percent when either input is null or baseline is zero', () => {
    expect(getChange(null, 100)).toEqual({ change: null, percent: null });
    expect(getChange(100, null)).toEqual({ change: null, percent: null });
    expect(getChange(100, 0)).toEqual({ change: null, percent: null });
  });

  it('calculates absolute change and percent change correctly', () => {
    expect(getChange(110, 100)).toEqual({ change: 10, percent: 10 });
    expect(getChange(90, 100)).toEqual({ change: -10, percent: -10 });
  });
});

describe('sortByPercentChange', () => {
  const makeRow = (symbol: string, price: number | null, previousClose: number | null = null) => ({
    symbol,
    companyName: symbol,
    price,
    previousClose,
    close30DaysAgo: null as number | null,
    close90DaysAgo: null as number | null,
    close1YearAgo: null as number | null,
  });

  it('returns rows in original order when sort mode is default', () => {
    const rows = [makeRow('B', 110, 100), makeRow('A', 90, 100)];
    const result = sortByPercentChange(rows, 'default', '1d');
    expect(result[0].symbol).toBe('B');
    expect(result[1].symbol).toBe('A');
  });

  it('sorts by 1-day percent change descending, with null-price rows last', () => {
    const rows = [
      makeRow('A', 105, 100),
      makeRow('B', 120, 100),
      makeRow('C', null, 100),
      makeRow('D', 90, 100),
    ];
    const result = sortByPercentChange(rows, '1d-desc', '1d');
    expect(result[0].symbol).toBe('B');
    expect(result[1].symbol).toBe('A');
    expect(result[2].symbol).toBe('D');
    expect(result[3].symbol).toBe('C');
  });
});
