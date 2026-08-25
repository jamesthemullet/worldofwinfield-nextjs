import fs from 'fs';
import { resolveCityCovers } from './city-covers';

jest.mock('fs');

const mockedExistsSync = jest.mocked(fs.existsSync);

beforeEach(() => {
  mockedExistsSync.mockReturnValue(false);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('resolveCityCovers', () => {
  it('returns the image path when a jpg file exists for the city', () => {
    mockedExistsSync.mockImplementation((filePath) => String(filePath).endsWith('ibiza-town.jpg'));

    const result = resolveCityCovers(['Ibiza Town']);

    expect(result['Ibiza Town']).toBe('/images/cities/ibiza-town.jpg');
  });

  it('returns null when no image file exists for the city', () => {
    const result = resolveCityCovers(['Unknown City']);

    expect(result['Unknown City']).toBeNull();
  });

  it('resolves multiple cities and keys the result by name', () => {
    mockedExistsSync.mockImplementation((filePath) => String(filePath).endsWith('paris.jpg'));

    const result = resolveCityCovers(['Paris', 'Unknown City']);

    expect(result['Paris']).toBe('/images/cities/paris.jpg');
    expect(result['Unknown City']).toBeNull();
  });
});
