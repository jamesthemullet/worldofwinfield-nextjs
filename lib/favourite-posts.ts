export type FavouriteTaggedPost = {
  slug: string;
  tags?: { edges: { node: { name: string } }[] } | null;
};

const normalise = (value: string): string => value.trim().toLowerCase();

function getTagNames(post: FavouriteTaggedPost): string[] {
  return (post.tags?.edges ?? []).map((edge) => normalise(edge.node.name));
}

// Finds posts tagged with a favourite entry's title (or any of its known
// aliases), so a favourite entry can surface "mentioned in a post" links
// without a second API call.
export function findPostsForFavourite<T extends FavouriteTaggedPost>(
  favouriteNames: string | string[],
  posts: T[],
  limit = 3,
): T[] {
  const targets = new Set(
    (Array.isArray(favouriteNames) ? favouriteNames : [favouriteNames])
      .map(normalise)
      .filter(Boolean),
  );

  if (targets.size === 0) {
    return [];
  }

  return posts.filter((post) => getTagNames(post).some((tag) => targets.has(tag))).slice(0, limit);
}
