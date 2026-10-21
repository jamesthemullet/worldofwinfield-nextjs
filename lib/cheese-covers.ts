import { resolveStaticCovers } from './static-covers';

// Open Food Facts' search-by-name is too unreliable for a curated list (rate-limited
// for anonymous callers, and match quality is poor for UK/artisan cheeses - see the
// beer cover art work, which hit the same problem). Instead this uses one static
// image per cheese, dropped into public/images/cheese/, named after the cheese (e.g.
// "Mature Blue Stilton" -> mature-blue-stilton.jpg). Add images as you get them; any
// cheese without a matching file falls back to the initials placeholder, so partial
// coverage is fine.

export const resolveCheeseCovers = (names: string[]): Record<string, string | null> =>
  resolveStaticCovers(names, 'cheese');
