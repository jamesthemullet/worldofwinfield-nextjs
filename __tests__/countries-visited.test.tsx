import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { fetchDataFromGoogleSheets } from '../lib/sheets';
import CountriesVisited, {
  extractWishListCountries,
  getStaticProps,
  processData,
} from '../pages/countries-visited';

// Builds minimal raw data: a header row followed by the given data rows.
// Each row has 14 columns (7 continents × 2 columns each: country + visited).
const makeRawData = (rows: string[][]): string[][] => [Array(14).fill('header'), ...rows];

const mockRouter = { isFallback: false };

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('next/dynamic', () => () => {
  const WorldMapMock = () => <div data-testid="world-map" />;
  WorldMapMock.displayName = 'WorldMapMock';
  return WorldMapMock;
});

jest.mock('../components/layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/container', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/post-header', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

jest.mock('../components/post-title', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="post-title">{children}</div>
  ),
}));

jest.mock('../components/share-bar', () => ({
  __esModule: true,
  default: () => <div data-testid="share-bar" />,
}));

jest.mock('../lib/sheets', () => ({
  fetchDataFromGoogleSheets: jest.fn(),
}));

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

describe('extractWishListCountries', () => {
  it('returns the values of the Country column', () => {
    const rawData = [
      ['Name', 'Country'],
      ['Kyoto', 'Japan'],
      ['Machu Picchu', 'Peru'],
    ];
    expect(extractWishListCountries(rawData)).toEqual(['Japan', 'Peru']);
  });

  it('finds the Country column regardless of position or casing', () => {
    const rawData = [
      ['country', 'Name'],
      ['Japan', 'Kyoto'],
    ];
    expect(extractWishListCountries(rawData)).toEqual(['Japan']);
  });

  it('skips rows with an empty country value', () => {
    const rawData = [
      ['Name', 'Country'],
      ['Kyoto', 'Japan'],
      ['Somewhere unplaced', ''],
    ];
    expect(extractWishListCountries(rawData)).toEqual(['Japan']);
  });

  it('returns an empty array when there is no Country column', () => {
    const rawData = [['Name'], ['Kyoto']];
    expect(extractWishListCountries(rawData)).toEqual([]);
  });

  it('returns an empty array for null or header-only data', () => {
    expect(extractWishListCountries(null)).toEqual([]);
    expect(extractWishListCountries([['Name', 'Country']])).toEqual([]);
  });
});

const sampleTransformedData = {
  Europe: [{ country: 'France', visited: '✔' }],
  'North America': [{ country: 'USA', visited: '' }],
};

describe('CountriesVisited component', () => {
  beforeEach(() => {
    mockRouter.isFallback = false;
  });

  it('renders the visited/total stats and country lists', () => {
    render(
      <CountriesVisited transformedData={sampleTransformedData} wishListCountries={['Japan']} />,
    );

    expect(screen.getByRole('heading', { name: 'Countries Visited' })).toBeInTheDocument();
    expect(screen.getAllByText('1 / 2')).toHaveLength(2);
    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
  });

  it('shows "Loading…" and hides the page content when the router is falling back', () => {
    mockRouter.isFallback = true;
    render(<CountriesVisited transformedData={sampleTransformedData} wishListCountries={[]} />);

    expect(screen.getByTestId('post-title')).toHaveTextContent('Loading…');
    expect(screen.queryByRole('heading', { name: 'Countries Visited' })).not.toBeInTheDocument();
  });

  it('renders zero stats when transformedData is empty', () => {
    render(<CountriesVisited transformedData={{}} wishListCountries={[]} />);

    expect(screen.getAllByText('0 / 0')).toHaveLength(2);
  });
});

describe('getStaticProps', () => {
  const mockedFetch = fetchDataFromGoogleSheets as jest.MockedFunction<
    typeof fetchDataFromGoogleSheets
  >;

  beforeEach(() => {
    mockedFetch.mockReset();
  });

  it('transforms sheet data into continent groups when the fetch succeeds', async () => {
    const rawData = makeRawData([
      ['France', 'Yes', 'USA', 'No', '', '', '', '', '', '', '', '', '', ''],
    ]);
    mockedFetch.mockResolvedValueOnce(rawData).mockResolvedValueOnce([
      ['Name', 'Country'],
      ['Kyoto', 'Japan'],
    ]);

    const result = await getStaticProps({});

    expect(result).toMatchObject({
      props: {
        transformedData: { Europe: [{ country: 'France', visited: '✔' }] },
        wishListCountries: ['Japan'],
      },
      revalidate: 86400,
    });
  });

  it('falls back to an empty transformedData object when the sheet fetch returns null', async () => {
    mockedFetch.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    const result = await getStaticProps({});

    expect(result).toMatchObject({
      props: {
        transformedData: {},
        wishListCountries: [],
      },
    });
  });
});
