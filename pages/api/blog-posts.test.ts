import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllPostsForHome } from '../../lib/api';
import handler from './blog-posts';

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

describe('GET /api/blog-posts', () => {
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

  it('returns 200 with posts for a GET request', async () => {
    const mockPosts = [{ id: '1', title: 'Test Post' }];
    (getAllPostsForHome as jest.Mock).mockResolvedValue(mockPosts);
    const req = createMockReq({ query: {} });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status as jest.Mock).toHaveBeenCalledWith(200);
    expect(res.json as jest.Mock).toHaveBeenCalledWith(mockPosts);
  });

  it('passes the after cursor to getAllPostsForHome when provided', async () => {
    (getAllPostsForHome as jest.Mock).mockResolvedValue([]);
    const req = createMockReq({ query: { after: 'cursor123' } });
    const res = createMockRes();
    await handler(req, res);
    expect(getAllPostsForHome).toHaveBeenCalledWith(false, 'cursor123');
  });
});
