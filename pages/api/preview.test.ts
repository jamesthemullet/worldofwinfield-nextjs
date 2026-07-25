import type { NextApiRequest, NextApiResponse } from 'next';
import { getPreviewPost } from '../../lib/api';
import handler from './preview';

jest.mock('../../lib/api');

function createMockReq(query: Record<string, string> = {}): NextApiRequest {
  return { query } as NextApiRequest;
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

describe('preview API', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    jest.clearAllMocks();
  });

  it('returns 401 when WORDPRESS_PREVIEW_SECRET env var is not set', async () => {
    delete process.env.WORDPRESS_PREVIEW_SECRET;
    const req = createMockReq({ secret: 'anything', id: '1' });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status as jest.Mock).toHaveBeenCalledWith(401);
    expect(res.json as jest.Mock).toHaveBeenCalledWith({ message: 'Invalid token' });
  });

  it('returns 401 when secret param does not match the env var', async () => {
    process.env.WORDPRESS_PREVIEW_SECRET = 'correct-secret';
    const req = createMockReq({ secret: 'wrong-secret', id: '1' });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status as jest.Mock).toHaveBeenCalledWith(401);
    expect(res.json as jest.Mock).toHaveBeenCalledWith({ message: 'Invalid token' });
  });

  it('returns 401 when post is not found', async () => {
    process.env.WORDPRESS_PREVIEW_SECRET = 'correct-secret';
    (getPreviewPost as jest.Mock).mockResolvedValue(null);
    const req = createMockReq({ secret: 'correct-secret', id: '99' });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status as jest.Mock).toHaveBeenCalledWith(401);
    expect(res.json as jest.Mock).toHaveBeenCalledWith({ message: 'Post not found' });
  });
});
