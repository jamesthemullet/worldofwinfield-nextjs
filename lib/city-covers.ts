import fs from 'fs';
import path from 'path';

// No free image API is used for cities — images are just static files dropped
// into public/images/cities/, named after the city (e.g. "Ibiza Town" ->
// ibiza-town.jpg). Add images as you get them; any city without a matching
// file falls back to the initials placeholder, so partial coverage is fine.

const CITY_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'cities');
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const slugify = (name: string): string =>
  name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const findCityImagePath = (name: string): string | null => {
  const slug = slugify(name);
  if (!slug) return null;

  for (const extension of SUPPORTED_EXTENSIONS) {
    const filePath = path.join(CITY_IMAGES_DIR, `${slug}${extension}`);
    if (fs.existsSync(filePath)) return `/images/cities/${slug}${extension}`;
  }

  return null;
};

// Keyed by name so lookups survive sorting/filtering in the UI without needing
// the cover art to travel alongside each row.
export const resolveCityCovers = (names: string[]): Record<string, string | null> =>
  Object.fromEntries(names.map((name) => [name, findCityImagePath(name)]));
