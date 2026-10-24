import fs from 'fs';
import path from 'path';

// Shared by the lib/*-covers.ts modules that each resolve a static cover image
// dropped into public/images/<dir>/, named after the item (e.g. "Mature Blue
// Stilton" -> mature-blue-stilton.jpg). Any item without a matching file falls
// back to the initials placeholder, so partial coverage is fine.

const IMAGES_ROOT = path.join(process.cwd(), 'public', 'images');
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export const slugify = (name: string): string =>
  name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const findStaticImagePath = (name: string, imagesDir: string): string | null => {
  const slug = slugify(name);
  if (!slug) return null;

  for (const extension of SUPPORTED_EXTENSIONS) {
    const filePath = path.join(IMAGES_ROOT, imagesDir, `${slug}${extension}`);
    if (fs.existsSync(filePath)) return `/images/${imagesDir}/${slug}${extension}`;
  }

  return null;
};

// Keyed by name so lookups survive sorting/filtering in the UI without needing
// the cover art to travel alongside each row.
export const resolveStaticCovers = (
  names: string[],
  imagesDir: string,
): Record<string, string | null> =>
  Object.fromEntries(names.map((name) => [name, findStaticImagePath(name, imagesDir)]));
