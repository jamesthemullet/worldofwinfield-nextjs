export type LocationTaggedPost = {
  slug: string;
  tags?: { edges: { node: { name: string } }[] } | null;
};

const normalise = (value: string): string => value.trim().toLowerCase();

function getTagNames(post: LocationTaggedPost): string[] {
  return (post.tags?.edges ?? []).map((edge) => normalise(edge.node.name));
}

// Finds posts tagged with a travel map location's name (or any of its known
// aliases, e.g. "USA" alongside "United States of America"), so a click on the
// map can surface "read about this place" links without a second API call.
export function findPostsForLocation<T extends LocationTaggedPost>(
  locationNames: string | string[],
  posts: T[],
  limit = 3,
): T[] {
  const targets = new Set(
    (Array.isArray(locationNames) ? locationNames : [locationNames]).map(normalise).filter(Boolean),
  );

  if (targets.size === 0) {
    return [];
  }

  return posts.filter((post) => getTagNames(post).some((tag) => targets.has(tag))).slice(0, limit);
}
