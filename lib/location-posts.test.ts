import { findPostsForLocation, type LocationTaggedPost } from './location-posts';

function makePost(slug: string, tagNames: string[]): LocationTaggedPost {
  return {
    slug,
    tags: { edges: tagNames.map((name) => ({ node: { name } })) },
  };
}

describe('findPostsForLocation', () => {
  it('returns posts tagged with the location name', () => {
    const posts = [makePost('rome-trip', ['Italy']), makePost('unrelated', ['Music'])];

    const result = findPostsForLocation('Italy', posts);

    expect(result.map((post) => post.slug)).toEqual(['rome-trip']);
  });

  it('matches location names case-insensitively', () => {
    const posts = [makePost('rome-trip', ['italy'])];

    const result = findPostsForLocation('Italy', posts);

    expect(result.map((post) => post.slug)).toEqual(['rome-trip']);
  });

  it('matches against any of a list of alias names', () => {
    const posts = [makePost('road-trip', ['USA'])];

    const result = findPostsForLocation(['United States of America', 'USA'], posts);

    expect(result.map((post) => post.slug)).toEqual(['road-trip']);
  });

  it('returns an empty array when no posts share the location tag', () => {
    const posts = [makePost('unrelated', ['Music'])];

    const result = findPostsForLocation('Italy', posts);

    expect(result).toEqual([]);
  });

  it('returns an empty array when given no location names', () => {
    const posts = [makePost('rome-trip', ['Italy'])];

    const result = findPostsForLocation([], posts);

    expect(result).toEqual([]);
  });

  it('ignores posts with no tags', () => {
    const posts = [{ slug: 'no-tags' }, makePost('rome-trip', ['Italy'])];

    const result = findPostsForLocation('Italy', posts);

    expect(result.map((post) => post.slug)).toEqual(['rome-trip']);
  });

  it('respects the limit parameter', () => {
    const posts = [makePost('a', ['Italy']), makePost('b', ['Italy']), makePost('c', ['Italy'])];

    const result = findPostsForLocation('Italy', posts, 2);

    expect(result).toHaveLength(2);
  });

  it('preserves post order', () => {
    const posts = [makePost('first', ['Italy']), makePost('second', ['Italy'])];

    const result = findPostsForLocation('Italy', posts);

    expect(result.map((post) => post.slug)).toEqual(['first', 'second']);
  });
});
