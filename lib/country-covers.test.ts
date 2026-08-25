import fs from 'fs';
import { resolveCountryCovers } from './country-covers';

jest.mock('fs');

const mockedExistsSync = jest.mocked(fs.existsSync);

beforeEach(() => {
  mockedExistsSync.mockReturnValue(false);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('resolveCountryCovers', () => {
  it('returns the image path when a jpg file exists for the country', () => {
    mockedExistsSync.mockImplementation((filePath) =>
      String(filePath).endsWith('north-macedonia.jpg'),
    );

    const result = resolveCountryCovers(['North Macedonia']);

    expect(result['North Macedonia']).toBe('/images/countries/north-macedonia.jpg');
  });

  it('returns null when no image file exists for the country', () => {
    const result = resolveCountryCovers(['Unknown Country']);

    expect(result['Unknown Country']).toBeNull();
  });

  it('checks all supported extensions in order, returning the first match', () => {
    mockedExistsSync.mockImplementation((filePath) => String(filePath).endsWith('france.webp'));

    const result = resolveCountryCovers(['France']);

    expect(result['France']).toBe('/images/countries/france.webp');
  });
});
