import fs from 'fs';
import { resolveWishListCovers } from './wish-list-covers';

jest.mock('fs');

const mockedExistsSync = jest.mocked(fs.existsSync);

beforeEach(() => {
  mockedExistsSync.mockReturnValue(false);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('resolveWishListCovers', () => {
  it('returns the image path when a jpg file exists for the place', () => {
    mockedExistsSync.mockImplementation((filePath) =>
      String(filePath).endsWith('san-sebastian.jpg'),
    );

    const result = resolveWishListCovers(['San Sebastian']);

    expect(result['San Sebastian']).toBe('/images/wish-list/san-sebastian.jpg');
  });

  it('returns null when no image file exists for the place', () => {
    const result = resolveWishListCovers(['Unknown Place']);

    expect(result['Unknown Place']).toBeNull();
  });

  it('resolves multiple places and keys the result by name', () => {
    mockedExistsSync.mockImplementation((filePath) => String(filePath).endsWith('tokyo.jpg'));

    const result = resolveWishListCovers(['Tokyo', 'Unknown Place']);

    expect(result['Tokyo']).toBe('/images/wish-list/tokyo.jpg');
    expect(result['Unknown Place']).toBeNull();
  });
});
