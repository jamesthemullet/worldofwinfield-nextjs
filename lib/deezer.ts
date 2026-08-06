const DEEZER_SEARCH_URL = 'https://api.deezer.com/search/artist';
const REQUEST_TIMEOUT_MS = 8000;
// Deezer allows ~50 requests per 5 seconds per IP. Requests are paced (not just
// concurrency-capped) to stay under that regardless of how fast responses come
// back — a large DJ sheet (~200 rows) previously blew through the limit in a
// couple of seconds, so everything past the first ~50 silently got a 429 and
// fell back to a placeholder.
const MAX_CONCURRENT_REQUESTS = 4;
const MIN_REQUEST_INTERVAL_MS = 120;

export type ArtistCoverLookup = {
  title: string;
};

// Mirrors the search normalisation in favourites-results.tsx: strips diacritics
// and punctuation so "babyschön" and "Babyschon" compare equal.
const normalizeName = (name: string): string =>
  (name || '')
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

export const resolveArtistCoverUrlByTitle = async ({
  title,
}: ArtistCoverLookup): Promise<string | null> => {
  if (!title) return null;

  try {
    // Deezer's search is fuzzy/phonetic, so the top hit for an obscure name is
    // often a completely different, better-known artist (e.g. "babyschön" ->
    // "Babyshambles"). Pull a handful of candidates and only accept one whose
    // name actually matches the query, rather than trusting relevance ranking.
    const params = new URLSearchParams({ q: title, limit: '5' });

    const response = await fetch(`${DEEZER_SEARCH_URL}?${params.toString()}`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return null;

    const json = await response.json();
    const candidates: { name?: string; picture_medium?: string }[] = json?.data ?? [];

    const normalizedTitle = normalizeName(title);
    const match = candidates.find(
      (candidate) => normalizeName(candidate.name ?? '') === normalizedTitle,
    );

    return typeof match?.picture_medium === 'string' ? match.picture_medium : null;
  } catch (error) {
    console.error('Error resolving Deezer artist cover:', error);
    return null;
  }
};

// Runs `fn` over `items` with at most `limit` in flight at once, and a minimum
// spacing between request starts, so a large sheet stays under Deezer's rate
// limit regardless of how quickly individual responses come back.
const mapWithConcurrency = async <T, R>(
  items: T[],
  limit: number,
  minIntervalMs: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> => {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;
  let lastStart = 0;

  const worker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++;

      const waitFor = lastStart + minIntervalMs - Date.now();
      if (waitFor > 0) await new Promise((resolve) => setTimeout(resolve, waitFor));
      lastStart = Date.now();

      results[index] = await fn(items[index]);
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));

  return results;
};

// Keyed by title so lookups survive sorting/filtering in the UI without needing
// the cover art to travel alongside each row.
export const resolveArtistCovers = async (
  artists: ArtistCoverLookup[],
): Promise<Record<string, string | null>> => {
  const entries = await mapWithConcurrency(
    artists,
    MAX_CONCURRENT_REQUESTS,
    MIN_REQUEST_INTERVAL_MS,
    async (artist) => [artist.title, await resolveArtistCoverUrlByTitle(artist)] as const,
  );

  return Object.fromEntries(entries);
};
