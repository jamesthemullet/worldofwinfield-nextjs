import { findStaticImagePath } from './static-covers';

// No API is used for beers — a search-by-name lookup against Open Food Facts or
// Untappd would be too unreliable for a curated list (mismatched labels, missing
// entries), and Untappd's API is closed to new keys anyway. Instead this looks
// for a static image dropped into public/images/beers/, checking the individual
// beer name first (e.g. "Shine" -> shine.jpg) and falling back to a shared
// brewery logo (e.g. "Moor Beer Company" -> moor-beer-company.jpg) when no
// beer-specific image exists. Any beer/brewery without a matching file falls
// back to the initials placeholder, so partial coverage is fine.

// Keyed by beer name (what the grid displays as the card title). Each entry
// prefers an image matching the beer itself, falling back to its brewery's
// shared image.
export const resolveBeerCovers = (
  entries: { beerName: string; brewery: string }[],
): Record<string, string | null> =>
  Object.fromEntries(
    entries.map(({ beerName, brewery }) => [
      beerName,
      findStaticImagePath(beerName, 'beers') ?? findStaticImagePath(brewery, 'beers'),
    ]),
  );
