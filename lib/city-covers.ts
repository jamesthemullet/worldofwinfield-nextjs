import { resolveStaticCovers } from './static-covers';

// No free image API is used for cities — images are just static files dropped
// into public/images/cities/, named after the city (e.g. "Ibiza Town" ->
// ibiza-town.jpg). Add images as you get them; any city without a matching
// file falls back to the initials placeholder, so partial coverage is fine.

export const resolveCityCovers = (names: string[]): Record<string, string | null> =>
  resolveStaticCovers(names, 'cities');
