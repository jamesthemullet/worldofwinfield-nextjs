import { resolveStaticCovers } from './static-covers';

// No free image API is used for the wish list — images are just static files dropped
// into public/images/wish-list/, named after the place (e.g. "San Sebastian" ->
// san-sebastian.jpg). Add images as you get them; any place without a matching
// file falls back to the initials placeholder, so partial coverage is fine.

export const resolveWishListCovers = (names: string[]): Record<string, string | null> =>
  resolveStaticCovers(names, 'wish-list');
