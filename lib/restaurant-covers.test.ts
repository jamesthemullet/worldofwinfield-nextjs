import fs from 'fs';
import { resolveRestaurantCovers } from './restaurant-covers';

jest.mock('fs');

const mockedReaddirSync = jest.mocked(fs.readdirSync);

const mockFiles = (files: string[]) => {
  mockedReaddirSync.mockReturnValue(files as unknown as ReturnType<typeof fs.readdirSync>);
};

beforeEach(() => {
  mockFiles([]);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('resolveRestaurantCovers', () => {
  it('returns the image path when a jpg file exists for the restaurant', () => {
    mockFiles(['quo-vadis.jpg']);

    const result = resolveRestaurantCovers(['Quo Vadis']);

    expect(result['Quo Vadis']).toBe('/images/restaurants/quo-vadis.jpg');
  });

  it('returns null when no image file exists for the restaurant', () => {
    mockFiles(['quo-vadis.jpg']);

    const result = resolveRestaurantCovers(['Unknown Restaurant']);

    expect(result['Unknown Restaurant']).toBeNull();
  });

  it('returns null for every restaurant when the images directory is missing', () => {
    mockedReaddirSync.mockImplementation(() => {
      throw new Error('ENOENT');
    });

    expect(resolveRestaurantCovers(['Quo Vadis'])['Quo Vadis']).toBeNull();
  });

  it('expands & to "and" when matching restaurant names', () => {
    mockFiles(['fish-and-chips.jpg']);

    const result = resolveRestaurantCovers(['Fish & Chips']);

    expect(result['Fish & Chips']).toBe('/images/restaurants/fish-and-chips.jpg');
  });

  it('ignores apostrophes in either the name or the filename', () => {
    mockFiles(['mcdonalds.jpg', 'chick-n-sours.jpg']);

    const result = resolveRestaurantCovers(["McDonald's", "Chick'n'Sours"]);

    expect(result["McDonald's"]).toBe('/images/restaurants/mcdonalds.jpg');
    expect(result["Chick'n'Sours"]).toBe('/images/restaurants/chick-n-sours.jpg');
  });

  it('matches names with commas, @ signs and accents', () => {
    mockFiles(['fish, wings and tings.jpg', 'jose-pizarro-ra.png', 'cafe.webp']);

    const result = resolveRestaurantCovers(['Fish, Wings And Tings', 'Jose Pizarro @ RA', 'Café']);

    expect(result['Fish, Wings And Tings']).toBe(
      '/images/restaurants/fish%2C%20wings%20and%20tings.jpg',
    );
    expect(result['Jose Pizarro @ RA']).toBe('/images/restaurants/jose-pizarro-ra.png');
    expect(result['Café']).toBe('/images/restaurants/cafe.webp');
  });

  it('ignores unsupported file types', () => {
    mockFiles(['README.md', 'quo-vadis.gif']);

    expect(resolveRestaurantCovers(['Quo Vadis'])['Quo Vadis']).toBeNull();
  });
});
