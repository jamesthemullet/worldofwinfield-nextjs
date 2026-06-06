import {
  getAdjacentPosts,
  getArchivePost,
  getRelatedPosts,
  searchBlogPosts,
} from './api';

const mockFetch = jest.fn();
global.fetch = mockFetch;

function makeResponse(payload: unknown) {
  return { json: () => Promise.resolve(payload) };
}

beforeEach(() => {
  process.env.WORDPRESS_API_URL = 'https://example.com/graphql';
  mockFetch.mockClear();
});

describe('fetchAPI', () => {
  it('throws when the GraphQL response contains errors', async () => {
    mockFetch.mockResolvedValueOnce(
      makeResponse({ errors: [{ message: 'Bad request' }] }),
    );
    await expect(searchBlogPosts('test')).rejects.toThrow('Failed to fetch API');
  });
});

describe('getRelatedPosts', () => {
  it('excludes the post that matches the given slug', async () => {
    mockFetch.mockResolvedValueOnce(
      makeResponse({
        data: {
          posts: {
            nodes: [
              { title: 'Post A', slug: 'post-a', date: '2024-01-01', excerpt: '', featuredImage: null },
              { title: 'Post B', slug: 'post-b', date: '2024-01-02', excerpt: '', featuredImage: null },
            ],
          },
        },
      }),
    );
    const result = await getRelatedPosts('tag', 'post-a');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('post-b');
  });

  it('caps results at 3 posts', async () => {
    const nodes = Array.from({ length: 4 }, (_, i) => ({
      title: `Post ${i}`,
      slug: `post-${i}`,
      date: '2024-01-01',
      excerpt: '',
      featuredImage: null,
    }));
    mockFetch.mockResolvedValueOnce(makeResponse({ data: { posts: { nodes } } }));
    const result = await getRelatedPosts('tag', 'nonexistent');
    expect(result).toHaveLength(3);
  });
});

describe('getAdjacentPosts', () => {
  it('returns null for previousPost when no earlier posts exist', async () => {
    mockFetch.mockResolvedValueOnce(
      makeResponse({
        data: {
          previousPost: { nodes: [] },
          nextPost: { nodes: [{ title: 'Next Post', slug: 'next-post' }] },
        },
      }),
    );
    const result = await getAdjacentPosts('2024-06-15T10:00:00');
    expect(result.previousPost).toBeNull();
    expect(result.nextPost).toEqual({ title: 'Next Post', slug: 'next-post' });
  });
});

describe('getArchivePost', () => {
  it('returns null when no posts are found for any year offset', async () => {
    mockFetch.mockResolvedValue(makeResponse({ data: { posts: { nodes: [] } } }));
    const result = await getArchivePost();
    expect(result).toBeNull();
    // offsets tried: [3, 2, 4] → 3 fetch calls
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('returns a post with yearsAgo=3 when posts exist 3 years back', async () => {
    mockFetch.mockResolvedValueOnce(
      makeResponse({
        data: {
          posts: {
            nodes: [{ title: 'Throwback Post', slug: 'throwback', date: '2021-01-01', featuredImage: null }],
          },
        },
      }),
    );
    const result = await getArchivePost();
    expect(result).not.toBeNull();
    expect(result?.yearsAgo).toBe(3);
    expect(result?.post.title).toBe('Throwback Post');
  });
});
