import fs from 'fs';
import { findStaticImagePath, resolveStaticCovers, slugify } from './static-covers';

jest.mock('fs');

const mockedExistsSync = jest.mocked(fs.existsSync);

beforeEach(() => {
  mockedExistsSync.mockReturnValue(false);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('slugify', () => {
  it('lowercases, strips accents and punctuation, and hyphenates spaces', () => {
    expect(slugify('Comté AOP')).toBe('comte-aop');
  });

  it('returns an empty string for names with no alphanumeric characters', () => {
    expect(slugify('!!!')).toBe('');
  });
});

describe('findStaticImagePath', () => {
  it('returns the image path when a supported file exists for the slugified name', () => {
    mockedExistsSync.mockImplementation((filePath) =>
      String(filePath).endsWith('mature-blue-stilton.jpg'),
    );

    expect(findStaticImagePath('Mature Blue Stilton', 'cheese')).toBe(
      '/images/cheese/mature-blue-stilton.jpg',
    );
  });

  it('returns null when no image file exists for the name', () => {
    expect(findStaticImagePath('Unknown', 'cheese')).toBeNull();
  });

  it('returns null when the name has no slug-able characters', () => {
    expect(findStaticImagePath('!!!', 'cheese')).toBeNull();
    expect(mockedExistsSync).not.toHaveBeenCalled();
  });
});

describe('resolveStaticCovers', () => {
  it('resolves each name to its image path or null', () => {
    mockedExistsSync.mockImplementation((filePath) => String(filePath).endsWith('ibiza-town.jpg'));

    const result = resolveStaticCovers(['Ibiza Town', 'Unknown City'], 'cities');

    expect(result['Ibiza Town']).toBe('/images/cities/ibiza-town.jpg');
    expect(result['Unknown City']).toBeNull();
  });
});
