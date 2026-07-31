import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllPostsForHome } from '../../lib/api';
import handler from './feed';

jest.mock('../../lib/api');

function createMockReq(overrides: Partial<NextApiRequest> = {}): NextApiRequest {
  return { method: 'GET', ...overrides } as NextApiRequest;
}

function createMockRes(): { res: NextApiResponse; sent: string } {
  const state = { sent: '' };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
    send: jest.fn((body: string) => {
      state.sent = body;
    }),
  } as unknown as NextApiResponse;
  return { res, sent: state.sent };
}

const mockPost = {
  title: 'Hello World',
  slug: 'hello-world',
  date: '2024-01-15T00:00:00',
  excerpt: '<p>A short <strong>excerpt</strong>.</p>',
};

describe('GET /api/feed', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 for non-GET requests', async () => {
    const req = createMockReq({ method: 'POST' });
    const { res } = createMockRes();
    await handler(req, res);
    expect(res.status as jest.Mock).toHaveBeenCalledWith(405);
    expect(res.json as jest.Mock).toHaveBeenCalledWith({ message: 'Method Not Allowed' });
  });

  it('sets the RSS Content-Type header', async () => {
    (getAllPostsForHome as jest.Mock).mockResolvedValue({ edges: [] });
    const req = createMockReq();
    const { res } = createMockRes();
    await handler(req, res);
    expect(res.setHeader as jest.Mock).toHaveBeenCalledWith(
      'Content-Type',
      'application/rss+xml; charset=utf-8',
    );
  });

  it('returns 200 for a valid GET request', async () => {
    (getAllPostsForHome as jest.Mock).mockResolvedValue({ edges: [] });
    const req = createMockReq();
    const { res } = createMockRes();
    await handler(req, res);
    expect(res.status as jest.Mock).toHaveBeenCalledWith(200);
  });

  it('includes the channel title and site URL in the RSS output', async () => {
    (getAllPostsForHome as jest.Mock).mockResolvedValue({ edges: [] });
    const req = createMockReq();
    const { res } = createMockRes();
    await handler(req, res);
    const xml = (res.send as jest.Mock).mock.calls[0][0] as string;
    expect(xml).toContain('<title>World Of Winfield</title>');
    expect(xml).toContain('<link>https://www.worldofwinfield.com</link>');
  });

  it('renders an RSS item for each post', async () => {
    (getAllPostsForHome as jest.Mock).mockResolvedValue({
      edges: [{ node: mockPost }],
    });
    const req = createMockReq();
    const { res } = createMockRes();
    await handler(req, res);
    const xml = (res.send as jest.Mock).mock.calls[0][0] as string;
    expect(xml).toContain('<![CDATA[Hello World]]>');
    expect(xml).toContain('https://www.worldofwinfield.com/posts/hello-world');
  });

  it('strips HTML tags from the excerpt in the RSS description', async () => {
    (getAllPostsForHome as jest.Mock).mockResolvedValue({
      edges: [{ node: mockPost }],
    });
    const req = createMockReq();
    const { res } = createMockRes();
    await handler(req, res);
    const xml = (res.send as jest.Mock).mock.calls[0][0] as string;
    expect(xml).toContain('<![CDATA[A short excerpt.]]>');
    expect(xml).not.toContain('<strong>');
  });

  it('handles posts with no excerpt gracefully', async () => {
    (getAllPostsForHome as jest.Mock).mockResolvedValue({
      edges: [{ node: { ...mockPost, excerpt: '' } }],
    });
    const req = createMockReq();
    const { res } = createMockRes();
    await handler(req, res);
    const xml = (res.send as jest.Mock).mock.calls[0][0] as string;
    expect(xml).toContain('<![CDATA[]]>');
  });
});
