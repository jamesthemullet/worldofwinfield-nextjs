import type { NextApiRequest, NextApiResponse } from 'next';
import { searchBlogPosts } from '../../lib/api';
import handler from './search';

jest.mock('../../lib/api');

function createMockReq(overrides: Partial<NextApiRequest> = {}): NextApiRequest {
  return { method: 'GET', query: {}, ...overrides } as NextApiRequest;
}

function createMockRes(): NextApiResponse {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as NextApiResponse;
}

describe('GET /api/search', () => {
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

  it('returns 200 with search results for a GET request', async () => {
    const mockPosts = [{ slug: 'test-post', title: 'Test Post' }];
    (searchBlogPosts as jest.Mock).mockResolvedValue(mockPosts);
    const req = createMockReq({ query: { q: 'test' } });
    const res = createMockRes();
    await handler(req, res);
    expect(searchBlogPosts).toHaveBeenCalledWith('test');
    expect(res.status as jest.Mock).toHaveBeenCalledWith(200);
    expect(res.json as jest.Mock).toHaveBeenCalledWith(mockPosts);
  });

  it('passes an empty string when no query is provided', async () => {
    (searchBlogPosts as jest.Mock).mockResolvedValue([]);
    const req = createMockReq({ query: {} });
    const res = createMockRes();
    await handler(req, res);
    expect(searchBlogPosts).toHaveBeenCalledWith('');
  });
});
