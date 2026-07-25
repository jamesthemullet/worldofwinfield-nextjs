import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllPostsForHome } from '../../lib/api';
import handler from './feed';

jest.mock('../../lib/api');

function createMockReq(overrides: Partial<NextApiRequest> = {}): NextApiRequest {
  return { method: 'GET', ...overrides } as NextApiRequest;
}

function createMockRes() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
    send: jest.fn(),
  };
  return res as unknown as NextApiResponse;
}

describe('GET /api/feed', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 405 for non-GET requests', async () => {
    const req = createMockReq({ method: 'POST' });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status as jest.Mock).toHaveBeenCalledWith(405);
    expect(res.json as jest.Mock).toHaveBeenCalledWith({ message: 'Method Not Allowed' });
  });

  it('strips HTML tags from post excerpts in the RSS output', async () => {
    (getAllPostsForHome as jest.Mock).mockResolvedValue({
      edges: [
        {
          node: {
            title: 'Test Post',
            slug: 'test-post',
            date: '2024-01-15',
            excerpt: '<p>Some <strong>HTML</strong> content</p>',
          },
        },
      ],
    });
    const req = createMockReq();
    const res = createMockRes();
    await handler(req, res);
    const sentContent = (res.send as jest.Mock).mock.calls[0][0] as string;
    expect(sentContent).toContain('Some HTML content');
    expect(sentContent).not.toContain('<strong>');
    expect(sentContent).toContain('<title><![CDATA[Test Post]]></title>');
  });
});
