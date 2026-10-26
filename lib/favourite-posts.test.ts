import { type FavouriteTaggedPost, findPostsForFavourite } from './favourite-posts';

function makePost(slug: string, tagNames: string[]): FavouriteTaggedPost {
  return {
    slug,
    tags: { edges: tagNames.map((name) => ({ node: { name } })) },
  };
}

describe('findPostsForFavourite', () => {
  it('returns posts tagged with the favourite entry name', () => {
    const posts = [makePost('dune-review', ['Dune']), makePost('unrelated', ['Music'])];

    const result = findPostsForFavourite('Dune', posts);

    expect(result.map((post) => post.slug)).toEqual(['dune-review']);
  });

  it('matches favourite names case-insensitively', () => {
    const posts = [makePost('dune-review', ['dune'])];

    const result = findPostsForFavourite('Dune', posts);

    expect(result.map((post) => post.slug)).toEqual(['dune-review']);
  });

  it('matches against any of a list of alias names', () => {
    const posts = [makePost('brewery-trip', ['BrewDog'])];

    const result = findPostsForFavourite(['Brew Dog', 'BrewDog'], posts);

    expect(result.map((post) => post.slug)).toEqual(['brewery-trip']);
  });

  it('returns an empty array when no posts share the favourite tag', () => {
    const posts = [makePost('unrelated', ['Music'])];

    const result = findPostsForFavourite('Dune', posts);

    expect(result).toEqual([]);
  });

  it('returns an empty array when given no favourite names', () => {
    const posts = [makePost('dune-review', ['Dune'])];

    const result = findPostsForFavourite([], posts);

    expect(result).toEqual([]);
  });

  it('ignores posts with no tags', () => {
    const posts = [{ slug: 'no-tags' }, makePost('dune-review', ['Dune'])];

    const result = findPostsForFavourite('Dune', posts);

    expect(result.map((post) => post.slug)).toEqual(['dune-review']);
  });

  it('respects the limit parameter', () => {
    const posts = [makePost('a', ['Dune']), makePost('b', ['Dune']), makePost('c', ['Dune'])];

    const result = findPostsForFavourite('Dune', posts, 2);

    expect(result).toHaveLength(2);
  });

  it('preserves post order', () => {
    const posts = [makePost('first', ['Dune']), makePost('second', ['Dune'])];

    const result = findPostsForFavourite('Dune', posts);

    expect(result.map((post) => post.slug)).toEqual(['first', 'second']);
  });
});
