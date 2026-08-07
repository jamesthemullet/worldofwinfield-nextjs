import fs from 'fs';
import path from 'path';

// Google Places Photos needs an API key with billing enabled, and the same
// search-by-name unreliability that hit beers/cheese would apply here too -
// so this uses one static image per restaurant, dropped into
// public/images/restaurants/, named after the restaurant (e.g. "Quo Vadis" ->
// quo-vadis.jpg). Add images as you get them; any restaurant without a
// matching file falls back to the initials placeholder, so partial coverage
// is fine.

const RESTAURANT_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'restaurants');
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const slugify = (name: string): string =>
  name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const findRestaurantImagePath = (name: string): string | null => {
  const slug = slugify(name);
  if (!slug) return null;

  for (const extension of SUPPORTED_EXTENSIONS) {
    const filePath = path.join(RESTAURANT_IMAGES_DIR, `${slug}${extension}`);
    if (fs.existsSync(filePath)) return `/images/restaurants/${slug}${extension}`;
  }

  return null;
};

// Keyed by name so lookups survive sorting/filtering in the UI without needing
// the cover art to travel alongside each row.
export const resolveRestaurantCovers = (names: string[]): Record<string, string | null> =>
  Object.fromEntries(names.map((name) => [name, findRestaurantImagePath(name)]));
