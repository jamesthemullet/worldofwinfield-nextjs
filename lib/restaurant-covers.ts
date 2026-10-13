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

// Matching ignores case, accents and all punctuation/whitespace, so
// "Chick'n'Sours" matches chick-n-sours.jpg or chicknsours.jpg, and
// "Fish, Wings And Tings" matches "fish, wings and tings.jpg".
const toMatchKey = (name: string): string =>
  name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]/g, '');

const buildImageIndex = (): Map<string, string> => {
  const index = new Map<string, string>();
  let files: string[];
  try {
    files = fs.readdirSync(RESTAURANT_IMAGES_DIR);
  } catch {
    return index;
  }

  for (const file of files) {
    const extension = path.extname(file).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(extension)) continue;
    const key = toMatchKey(path.basename(file, path.extname(file)));
    if (key && !index.has(key)) index.set(key, `/images/restaurants/${encodeURIComponent(file)}`);
  }

  return index;
};

// Keyed by name so lookups survive sorting/filtering in the UI without needing
// the cover art to travel alongside each row.
export const resolveRestaurantCovers = (names: string[]): Record<string, string | null> => {
  const index = buildImageIndex();
  return Object.fromEntries(names.map((name) => [name, index.get(toMatchKey(name ?? '')) ?? null]));
};
