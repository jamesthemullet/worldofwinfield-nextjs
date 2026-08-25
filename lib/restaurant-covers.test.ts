import fs from 'fs';
import { resolveRestaurantCovers } from './restaurant-covers';

jest.mock('fs');

const mockedExistsSync = jest.mocked(fs.existsSync);

beforeEach(() => {
  mockedExistsSync.mockReturnValue(false);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('resolveRestaurantCovers', () => {
  it('returns the image path when a jpg file exists for the restaurant', () => {
    mockedExistsSync.mockImplementation((filePath) => String(filePath).endsWith('quo-vadis.jpg'));

    const result = resolveRestaurantCovers(['Quo Vadis']);

    expect(result['Quo Vadis']).toBe('/images/restaurants/quo-vadis.jpg');
  });

  it('returns null when no image file exists for the restaurant', () => {
    const result = resolveRestaurantCovers(['Unknown Restaurant']);

    expect(result['Unknown Restaurant']).toBeNull();
  });

  it('expands & to "and" when slugifying restaurant names', () => {
    mockedExistsSync.mockImplementation((filePath) =>
      String(filePath).endsWith('fish-and-chips.jpg'),
    );

    const result = resolveRestaurantCovers(['Fish & Chips']);

    expect(result['Fish & Chips']).toBe('/images/restaurants/fish-and-chips.jpg');
  });

  it('strips apostrophes when slugifying restaurant names', () => {
    mockedExistsSync.mockImplementation((filePath) => String(filePath).endsWith('mcdonalds.jpg'));

    const result = resolveRestaurantCovers(["McDonald's"]);

    expect(result["McDonald's"]).toBe('/images/restaurants/mcdonalds.jpg');
  });
});
