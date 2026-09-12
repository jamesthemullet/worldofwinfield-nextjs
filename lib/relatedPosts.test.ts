import { findRelatedPosts, type PostWithTags } from './relatedPosts';

function makePost(slug: string, tagNames: string[]): PostWithTags {
  return {
    slug,
    tags: { edges: tagNames.map((name) => ({ node: { name } })) },
  };
}

describe('findRelatedPosts', () => {
  it('returns posts that share at least one tag', () => {
    const current = makePost('current', ['Travel', 'Beer']);
    const candidates = [makePost('unrelated', ['Music']), makePost('shares-beer', ['Beer'])];

    const result = findRelatedPosts(current, candidates);

    expect(result.map((post) => post.slug)).toEqual(['shares-beer']);
  });

  it('ranks posts with more shared tags first', () => {
    const current = makePost('current', ['Travel', 'Beer', 'Music']);
    const oneShared = makePost('one-shared', ['Beer']);
    const twoShared = makePost('two-shared', ['Beer', 'Music']);

    const result = findRelatedPosts(current, [oneShared, twoShared]);

    expect(result.map((post) => post.slug)).toEqual(['two-shared', 'one-shared']);
  });

  it('matches tags case-insensitively', () => {
    const current = makePost('current', ['Travel']);
    const candidate = makePost('candidate', ['travel']);

    const result = findRelatedPosts(current, [candidate]);

    expect(result.map((post) => post.slug)).toEqual(['candidate']);
  });

  it('excludes the current post even if it appears in the candidate list', () => {
    const current = makePost('current', ['Travel']);
    const candidates = [current, makePost('other', ['Travel'])];

    const result = findRelatedPosts(current, candidates);

    expect(result.map((post) => post.slug)).toEqual(['other']);
  });

  it('returns an empty array when the current post has no tags', () => {
    const current = makePost('current', []);
    const candidates = [makePost('other', ['Travel'])];

    const result = findRelatedPosts(current, candidates);

    expect(result).toEqual([]);
  });

  it('respects the limit parameter', () => {
    const current = makePost('current', ['Travel']);
    const candidates = [
      makePost('a', ['Travel']),
      makePost('b', ['Travel']),
      makePost('c', ['Travel']),
    ];

    const result = findRelatedPosts(current, candidates, 2);

    expect(result).toHaveLength(2);
  });

  it('preserves candidate order to break ties in shared tag count', () => {
    const current = makePost('current', ['Travel']);
    const candidates = [makePost('first', ['Travel']), makePost('second', ['Travel'])];

    const result = findRelatedPosts(current, candidates);

    expect(result.map((post) => post.slug)).toEqual(['first', 'second']);
  });
});
