import {
  searchBlogPosts,
  getRelatedPosts,
  getAdjacentPosts,
  getPostsByDate,
  getArchivePost,
} from './api';

const mockFetch = jest.fn();
global.fetch = mockFetch as typeof fetch;

function gqlSuccess(data: Record<string, unknown>) {
  return { json: () => Promise.resolve({ data }) };
}

beforeAll(() => {
  process.env.WORDPRESS_API_URL = 'https://test.example.com/graphql';
});

afterAll(() => {
  delete process.env.WORDPRESS_API_URL;
});

beforeEach(() => {
  mockFetch.mockReset();
  delete process.env.WORDPRESS_AUTH_REFRESH_TOKEN;
});

describe('fetchAPI (via exported functions)', () => {
  it('throws "Failed to fetch API" when the response contains GraphQL errors', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ errors: [{ message: 'Not found' }] }),
    });
    await expect(searchBlogPosts('x')).rejects.toThrow('Failed to fetch API');
    jest.restoreAllMocks();
  });

  it('includes Authorization header when WORDPRESS_AUTH_REFRESH_TOKEN is set', async () => {
    process.env.WORDPRESS_AUTH_REFRESH_TOKEN = 'secret-token';
    mockFetch.mockResolvedValue(gqlSuccess({ posts: { nodes: [] } }));

    await searchBlogPosts('hello');

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)['Authorization']).toBe(
      'Bearer secret-token',
    );
  });
});

describe('searchBlogPosts', () => {
  it('returns the nodes array from the API response', async () => {
    const nodes = [{ slug: 'a', title: 'A', date: '2024-01-01', excerpt: '' }];
    mockFetch.mockResolvedValue(gqlSuccess({ posts: { nodes } }));

    const result = await searchBlogPosts('query');
    expect(result).toEqual(nodes);
  });
});

describe('getRelatedPosts', () => {
  it('excludes the current post slug and limits results to 3', async () => {
    const nodes = [
      { title: 'A', slug: 'current-post', date: '2024-01-01', excerpt: '' },
      { title: 'B', slug: 'related-1', date: '2024-01-02', excerpt: '' },
      { title: 'C', slug: 'related-2', date: '2024-01-03', excerpt: '' },
      { title: 'D', slug: 'related-3', date: '2024-01-04', excerpt: '' },
      { title: 'E', slug: 'related-4', date: '2024-01-05', excerpt: '' },
    ];
    mockFetch.mockResolvedValue(gqlSuccess({ posts: { nodes } }));

    const result = await getRelatedPosts('some-tag', 'current-post');

    expect(result).toHaveLength(3);
    expect(result.every((p) => p.slug !== 'current-post')).toBe(true);
  });
});

describe('getAdjacentPosts', () => {
  it('parses the date string and sends correct year/month/day variables', async () => {
    const dateStr = '2023-07-14T12:00:00.000Z';
    const parsed = new Date(dateStr);
    mockFetch.mockResolvedValue(
      gqlSuccess({ previousPost: { nodes: [] }, nextPost: { nodes: [] } }),
    );

    await getAdjacentPosts(dateStr);

    const body = JSON.parse(
      (mockFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.variables).toEqual({
      year: parsed.getFullYear(),
      month: parsed.getMonth() + 1,
      day: parsed.getDate(),
    });
  });

  it('returns null for both posts when the API returns empty node arrays', async () => {
    mockFetch.mockResolvedValue(
      gqlSuccess({ previousPost: { nodes: [] }, nextPost: { nodes: [] } }),
    );

    const result = await getAdjacentPosts('2023-07-14T12:00:00.000Z');
    expect(result).toEqual({ previousPost: null, nextPost: null });
  });
});

describe('getPostsByDate', () => {
  it('returns the queried month and year alongside the posts', async () => {
    const nodes = [{ title: 'Old post', slug: 'old', date: '2021-05-01' }];
    mockFetch.mockResolvedValue(gqlSuccess({ posts: { nodes } }));

    const result = await getPostsByDate(5, 2021);
    expect(result).toEqual({ posts: nodes, month: 5, year: 2021 });
  });
});

describe('getArchivePost', () => {
  it('falls back to the next year offset when the first query returns no posts', async () => {
    const nodes = [{ title: 'Old Post', slug: 'old', date: '2022-01-01' }];
    // offset 3 → empty; offset 2 → has posts
    mockFetch
      .mockResolvedValueOnce(gqlSuccess({ posts: { nodes: [] } }))
      .mockResolvedValueOnce(gqlSuccess({ posts: { nodes } }));

    const result = await getArchivePost();

    expect(result).not.toBeNull();
    expect(result!.yearsAgo).toBe(2);
    expect(result!.post.slug).toBe('old');
  });

  it('returns null when all year offsets return no posts', async () => {
    mockFetch.mockResolvedValue(gqlSuccess({ posts: { nodes: [] } }));

    const result = await getArchivePost();
    expect(result).toBeNull();
  });
});
