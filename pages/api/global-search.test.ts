import type { NextApiRequest, NextApiResponse } from 'next';
import { searchBlogPosts } from '../../lib/api';
import { searchableSheets } from '../../lib/search-sheets';
import { fetchDataFromGoogleSheets } from '../../lib/sheets';
import handler from './global-search';

jest.mock('../../lib/api');
jest.mock('../../lib/sheets');

function createMockReq(overrides: Partial<NextApiRequest> = {}): NextApiRequest {
  return { method: 'GET', query: {}, ...overrides } as NextApiRequest;
}

function createMockRes(): NextApiResponse {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as NextApiResponse;
}

describe('GET /api/global-search', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 for non-GET requests', async () => {
    const req = createMockReq({ method: 'POST' });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status as jest.Mock).toHaveBeenCalledWith(405);
    expect(res.json as jest.Mock).toHaveBeenCalledWith({ message: 'Method Not Allowed' });
  });

  it('returns blog posts and matching sheet rows grouped by category', async () => {
    const mockPosts = [{ slug: 'barcelona-trip', title: 'Barcelona Trip', date: '2023-01-01' }];
    (searchBlogPosts as jest.Mock).mockResolvedValue(mockPosts);
    (fetchDataFromGoogleSheets as jest.Mock).mockImplementation(async (sheetId: string) => {
      const booksSheet = searchableSheets.find((sheet) => sheet.key === 'books')!;
      const citiesSheet = searchableSheets.find((sheet) => sheet.key === 'cities')!;
      if (sheetId === booksSheet.sheetId) {
        return [
          ['Author', 'Title', 'Score', 'Year Read', 'Comments'],
          ['Haruki Murakami', 'Norwegian Wood', '9', '2020', ''],
          ['George Orwell', '1984', '10', '2019', ''],
        ];
      }
      if (sheetId === citiesSheet.sheetId) {
        return [['Name'], ['Barcelona'], ['Tokyo']];
      }
      return [];
    });

    const req = createMockReq({ query: { q: 'barcelona' } });
    const res = createMockRes();
    await handler(req, res);

    expect(res.status as jest.Mock).toHaveBeenCalledWith(200);
    const payload = (res.json as jest.Mock).mock.calls[0][0];
    expect(payload.posts).toEqual(mockPosts);
    expect(payload.cities).toEqual([
      { title: 'Barcelona', subtitle: undefined, url: '/favourite-cities' },
    ]);
    expect(payload.books).toBeUndefined();
  });

  it('omits categories with no matching rows', async () => {
    (searchBlogPosts as jest.Mock).mockResolvedValue([]);
    (fetchDataFromGoogleSheets as jest.Mock).mockResolvedValue(null);

    const req = createMockReq({ query: { q: 'nothing-matches-anything' } });
    const res = createMockRes();
    await handler(req, res);

    const payload = (res.json as jest.Mock).mock.calls[0][0];
    expect(payload).toEqual({ posts: [] });
  });

  it('passes an empty string when no query is provided', async () => {
    (searchBlogPosts as jest.Mock).mockResolvedValue([]);
    (fetchDataFromGoogleSheets as jest.Mock).mockResolvedValue(null);
    const req = createMockReq({ query: {} });
    const res = createMockRes();
    await handler(req, res);
    expect(searchBlogPosts).toHaveBeenCalledWith('');
  });
});
