import fs from 'fs';
import path from 'path';

// Open Food Facts' search-by-name is too unreliable for a curated list (rate-limited
// for anonymous callers, and match quality is poor for UK/artisan cheeses - see the
// beer cover art work, which hit the same problem). Instead this uses one static
// image per cheese, dropped into public/images/cheese/, named after the cheese (e.g.
// "Mature Blue Stilton" -> mature-blue-stilton.jpg). Add images as you get them; any
// cheese without a matching file falls back to the initials placeholder, so partial
// coverage is fine.

const CHEESE_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'cheese');
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const slugify = (name: string): string =>
  name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const findCheeseImagePath = (name: string): string | null => {
  const slug = slugify(name);
  if (!slug) return null;

  for (const extension of SUPPORTED_EXTENSIONS) {
    const filePath = path.join(CHEESE_IMAGES_DIR, `${slug}${extension}`);
    if (fs.existsSync(filePath)) return `/images/cheese/${slug}${extension}`;
  }

  return null;
};

// Keyed by name so lookups survive sorting/filtering in the UI without needing
// the cover art to travel alongside each row.
export const resolveCheeseCovers = (names: string[]): Record<string, string | null> =>
  Object.fromEntries(names.map((name) => [name, findCheeseImagePath(name)]));
