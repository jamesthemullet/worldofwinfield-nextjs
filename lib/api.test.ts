import { getAdjacentPosts, getRelatedPosts } from './api';
import type { RelatedPost } from './types';

const mockFetch = jest.fn();
global.fetch = mockFetch;

function mockApiResponse(data: unknown) {
  mockFetch.mockResolvedValueOnce({
    json: () => Promise.resolve({ data }),
  });
}

beforeEach(() => {
  process.env.WORDPRESS_API_URL = 'http://test.example.com/graphql';
  mockFetch.mockClear();
});

describe('getRelatedPosts', () => {
  it('filters out the post matching excludeSlug', async () => {
    const nodes: RelatedPost[] = [
      { title: 'Post A', slug: 'post-a', date: '2024-01-01', excerpt: '', featuredImage: null },
      { title: 'Post B', slug: 'post-b', date: '2024-01-02', excerpt: '', featuredImage: null },
    ];
    mockApiResponse({ posts: { nodes } });

    const result = await getRelatedPosts('tag', 'post-a');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('post-b');
  });

  it('limits results to 3 even when the API returns more posts', async () => {
    const nodes: RelatedPost[] = Array.from({ length: 4 }, (_, i) => ({
      title: `Post ${i}`,
      slug: `post-${i}`,
      date: '2024-01-01',
      excerpt: '',
      featuredImage: null,
    }));
    mockApiResponse({ posts: { nodes } });

    const result = await getRelatedPosts('tag', 'non-existent');
    expect(result).toHaveLength(3);
  });
});

describe('getAdjacentPosts', () => {
  it('returns null for both previousPost and nextPost when no adjacent posts exist', async () => {
    mockApiResponse({
      previousPost: { nodes: [] },
      nextPost: { nodes: [] },
    });

    const result = await getAdjacentPosts('2024-06-15T12:00:00');
    expect(result.previousPost).toBeNull();
    expect(result.nextPost).toBeNull();
  });
});
