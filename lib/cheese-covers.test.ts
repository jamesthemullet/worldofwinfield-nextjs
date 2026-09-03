import fs from 'fs';
import { resolveCheeseCovers } from './cheese-covers';

jest.mock('fs');

const mockedExistsSync = jest.mocked(fs.existsSync);

beforeEach(() => {
  mockedExistsSync.mockReturnValue(false);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('resolveCheeseCovers', () => {
  it('returns the image path when a jpg file exists for the cheese', () => {
    mockedExistsSync.mockImplementation((filePath) =>
      String(filePath).endsWith('mature-blue-stilton.jpg'),
    );

    const result = resolveCheeseCovers(['Mature Blue Stilton']);

    expect(result['Mature Blue Stilton']).toBe('/images/cheese/mature-blue-stilton.jpg');
  });

  it('returns null when no image file exists for the cheese', () => {
    const result = resolveCheeseCovers(['Unknown Cheese']);

    expect(result['Unknown Cheese']).toBeNull();
  });

  it('slugifies cheese names with special characters when looking up files', () => {
    mockedExistsSync.mockImplementation((filePath) => String(filePath).endsWith('comte-aop.jpg'));

    const result = resolveCheeseCovers(['Comté AOP']);

    expect(result['Comté AOP']).toBe('/images/cheese/comte-aop.jpg');
  });
});
