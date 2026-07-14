import type { NextApiRequest, NextApiResponse } from 'next';
import { getPreviewPost } from '../../lib/api';
import handler from './preview';

jest.mock('../../lib/api');

const VALID_SECRET = 'test-secret-123';

function createMockReq(query: Record<string, string> = {}): NextApiRequest {
  return { query } as unknown as NextApiRequest;
}

function createMockRes(): NextApiResponse {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setPreviewData: jest.fn(),
    writeHead: jest.fn(),
    end: jest.fn(),
  } as unknown as NextApiResponse;
}

describe('GET /api/preview', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, WORDPRESS_PREVIEW_SECRET: VALID_SECRET };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('returns 401 when the WORDPRESS_PREVIEW_SECRET env var is not set', async () => {
    delete process.env.WORDPRESS_PREVIEW_SECRET;
    const req = createMockReq({ secret: VALID_SECRET, slug: 'my-post' });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status as jest.Mock).toHaveBeenCalledWith(401);
    expect(res.json as jest.Mock).toHaveBeenCalledWith({ message: 'Invalid token' });
  });

  it('returns 401 when the secret does not match', async () => {
    const req = createMockReq({ secret: 'wrong-secret', slug: 'my-post' });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status as jest.Mock).toHaveBeenCalledWith(401);
    expect(res.json as jest.Mock).toHaveBeenCalledWith({ message: 'Invalid token' });
  });

  it('returns 401 when neither id nor slug is provided', async () => {
    const req = createMockReq({ secret: VALID_SECRET });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status as jest.Mock).toHaveBeenCalledWith(401);
    expect(res.json as jest.Mock).toHaveBeenCalledWith({ message: 'Invalid token' });
  });

  it('returns 401 when the post is not found', async () => {
    (getPreviewPost as jest.Mock).mockResolvedValue(null);
    const req = createMockReq({ secret: VALID_SECRET, slug: 'nonexistent-post' });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status as jest.Mock).toHaveBeenCalledWith(401);
    expect(res.json as jest.Mock).toHaveBeenCalledWith({ message: 'Post not found' });
  });

  it('sets preview data and redirects by slug when the post exists', async () => {
    const mockPost = { databaseId: 42, slug: 'my-post', status: 'draft' };
    (getPreviewPost as jest.Mock).mockResolvedValue(mockPost);
    const req = createMockReq({ secret: VALID_SECRET, slug: 'my-post' });
    const res = createMockRes();
    await handler(req, res);
    expect(res.setPreviewData as jest.Mock).toHaveBeenCalledWith({
      post: { id: 42, slug: 'my-post', status: 'draft' },
    });
    expect(res.writeHead as jest.Mock).toHaveBeenCalledWith(307, { Location: '/my-post' });
    expect(res.end as jest.Mock).toHaveBeenCalled();
  });

  it('queries by DATABASE_ID when an id param is provided', async () => {
    const mockPost = { databaseId: 99, slug: 'found-by-id', status: 'draft' };
    (getPreviewPost as jest.Mock).mockResolvedValue(mockPost);
    const req = createMockReq({ secret: VALID_SECRET, id: '99' });
    const res = createMockRes();
    await handler(req, res);
    expect(getPreviewPost).toHaveBeenCalledWith('99', 'DATABASE_ID');
  });

  it('queries by SLUG when only a slug param is provided', async () => {
    const mockPost = { databaseId: 7, slug: 'slug-post', status: 'publish' };
    (getPreviewPost as jest.Mock).mockResolvedValue(mockPost);
    const req = createMockReq({ secret: VALID_SECRET, slug: 'slug-post' });
    const res = createMockRes();
    await handler(req, res);
    expect(getPreviewPost).toHaveBeenCalledWith('slug-post', 'SLUG');
  });
});
