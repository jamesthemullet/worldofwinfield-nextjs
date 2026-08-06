const DEEZER_SEARCH_URL = 'https://api.deezer.com/search/artist';
const REQUEST_TIMEOUT_MS = 8000;
// Deezer allows ~50 requests per 5 seconds per IP; keep well under that so a
// large DJ sheet (~200 rows) doesn't start getting throttled mid-build.
const MAX_CONCURRENT_REQUESTS = 8;

export type ArtistCoverLookup = {
  title: string;
};

export const resolveArtistCoverUrlByTitle = async ({
  title,
}: ArtistCoverLookup): Promise<string | null> => {
  if (!title) return null;

  try {
    const params = new URLSearchParams({ q: title, limit: '1' });

    const response = await fetch(`${DEEZER_SEARCH_URL}?${params.toString()}`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return null;

    const json = await response.json();
    const pictureUrl = json?.data?.[0]?.picture_medium;

    return typeof pictureUrl === 'string' ? pictureUrl : null;
  } catch (error) {
    console.error('Error resolving Deezer artist cover:', error);
    return null;
  }
};

// Runs `fn` over `items` with at most `limit` in flight at once, so a large
// sheet doesn't fire hundreds of simultaneous requests and trip Deezer's rate limit.
const mapWithConcurrency = async <T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> => {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
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
    async (artist) => [artist.title, await resolveArtistCoverUrlByTitle(artist)] as const,
  );

  return Object.fromEntries(entries);
};
