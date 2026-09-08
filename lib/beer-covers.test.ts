import fs from 'fs';
import { resolveBeerCovers } from './beer-covers';

jest.mock('fs');

const mockedExistsSync = jest.mocked(fs.existsSync);

beforeEach(() => {
  mockedExistsSync.mockReturnValue(false);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('resolveBeerCovers', () => {
  it('returns the image path when a jpg file exists for the brewery', () => {
    mockedExistsSync.mockImplementation((filePath) =>
      String(filePath).endsWith('moor-beer-company.jpg'),
    );

    const result = resolveBeerCovers([{ beerName: 'Dark Star', brewery: 'Moor Beer Company' }]);

    expect(result['Dark Star']).toBe('/images/beers/moor-beer-company.jpg');
  });

  it('returns null when no image file exists for the brewery', () => {
    mockedExistsSync.mockReturnValue(false);

    const result = resolveBeerCovers([{ beerName: 'Unknown Pint', brewery: 'Unknown Brewery' }]);

    expect(result['Unknown Pint']).toBeNull();
  });

  it('slugifies brewery names with spaces and punctuation when looking up files', () => {
    mockedExistsSync.mockImplementation((filePath) =>
      String(filePath).endsWith('brasserie-dupont.jpg'),
    );

    const result = resolveBeerCovers([{ beerName: 'Saison Dupont', brewery: 'Brasserie Dupont' }]);

    expect(result['Saison Dupont']).toBe('/images/beers/brasserie-dupont.jpg');
  });

  it('prefers a beer-specific image over the brewery image when both exist', () => {
    mockedExistsSync.mockImplementation(
      (filePath) =>
        String(filePath).endsWith('shine.jpg') || String(filePath).endsWith('moor-beer-company.jpg'),
    );

    const result = resolveBeerCovers([{ beerName: 'Shine', brewery: 'Moor Beer Company' }]);

    expect(result.Shine).toBe('/images/beers/shine.jpg');
  });

  it('falls back to the brewery image when no beer-specific image exists', () => {
    mockedExistsSync.mockImplementation((filePath) =>
      String(filePath).endsWith('moor-beer-company.jpg'),
    );

    const result = resolveBeerCovers([{ beerName: 'Some Other Beer', brewery: 'Moor Beer Company' }]);

    expect(result['Some Other Beer']).toBe('/images/beers/moor-beer-company.jpg');
  });
});
