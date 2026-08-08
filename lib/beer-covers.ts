import fs from 'fs';
import path from 'path';

// No API is used for beers — a search-by-name lookup against Open Food Facts or
// Untappd would be too unreliable for a curated list (mismatched labels, missing
// entries), and Untappd's API is closed to new keys anyway. Instead this reuses
// one static image per brewery (a logo, dropped into public/images/beers/,
// named after the brewery e.g. "Moor Beer Company" -> moor-beer-company.jpg)
// across every beer from that brewery, rather than trying to source a photo of
// each individual beer. Any brewery without a matching file falls back to the
// initials placeholder, so partial coverage is fine.

const BEER_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'beers');
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const slugify = (name: string): string =>
  name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const findBreweryImagePath = (brewery: string): string | null => {
  const slug = slugify(brewery);
  if (!slug) return null;

  for (const extension of SUPPORTED_EXTENSIONS) {
    const filePath = path.join(BEER_IMAGES_DIR, `${slug}${extension}`);
    if (fs.existsSync(filePath)) return `/images/beers/${slug}${extension}`;
  }

  return null;
};

// Keyed by beer name (what the grid displays as the card title), each pointing
// at its brewery's shared image.
export const resolveBeerCovers = (
  entries: { beerName: string; brewery: string }[],
): Record<string, string | null> =>
  Object.fromEntries(
    entries.map(({ beerName, brewery }) => [beerName, findBreweryImagePath(brewery)]),
  );
