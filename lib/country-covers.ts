import { resolveStaticCovers } from './static-covers';

// No free image API is used for countries — images are just static files dropped
// into public/images/countries/, named after the country (e.g. "North Macedonia"
// -> north-macedonia.jpg). Add images as you get them; any country without a
// matching file falls back to the initials placeholder, so partial coverage is fine.

export const resolveCountryCovers = (names: string[]): Record<string, string | null> =>
  resolveStaticCovers(names, 'countries');
