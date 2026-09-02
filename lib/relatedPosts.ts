export type PostWithTags = {
  slug: string;
  tags?: { edges: { node: { name: string } }[] } | null;
};

function getTagNames(post: PostWithTags): string[] {
  return (post.tags?.edges ?? []).map((edge) => edge.node.name.toLowerCase());
}

// Ranks candidates by number of shared tags (desc), keeping candidatePosts' order to break ties.
export function findRelatedPosts<T extends PostWithTags>(
  currentPost: T,
  candidatePosts: T[],
  limit = 3,
): T[] {
  const currentTags = new Set(getTagNames(currentPost));
  if (currentTags.size === 0) {
    return [];
  }

  const scored = candidatePosts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => ({
      post,
      sharedTagCount: getTagNames(post).filter((tag) => currentTags.has(tag)).length,
    }))
    .filter(({ sharedTagCount }) => sharedTagCount > 0);

  scored.sort((a, b) => b.sharedTagCount - a.sharedTagCount);

  return scored.slice(0, limit).map(({ post }) => post);
}
