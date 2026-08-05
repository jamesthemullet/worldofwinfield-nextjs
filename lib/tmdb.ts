const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342';
const REQUEST_TIMEOUT_MS = 8000;
// TMDB starts returning 429s once too many lookups are in flight at once
// (observed failures past ~100 concurrent requests against a 236-movie sheet).
const MAX_CONCURRENT_REQUESTS = 15;

export type MovieCoverLookup = {
  title: string;
  year?: string;
};

export const resolveMovieCoverUrlByTitle = async ({
  title,
  year,
}: MovieCoverLookup): Promise<string | null> => {
  if (!title) return null;

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  try {
    const params = new URLSearchParams({ api_key: apiKey, query: title });
    if (year) params.set('year', year);

    const response = await fetch(`${TMDB_SEARCH_URL}?${params.toString()}`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return null;

    const json = await response.json();
    const posterPath = json?.results?.[0]?.poster_path;

    return typeof posterPath === 'string' ? `${TMDB_IMAGE_BASE_URL}${posterPath}` : null;
  } catch (error) {
    console.error('Error resolving TMDB cover:', error);
    return null;
  }
};

// Runs `fn` over `items` with at most `limit` in flight at once, so a large
// sheet doesn't fire hundreds of simultaneous requests and trip TMDB's rate limit.
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
export const resolveMovieCovers = async (
  movies: MovieCoverLookup[],
): Promise<Record<string, string | null>> => {
  const entries = await mapWithConcurrency(
    movies,
    MAX_CONCURRENT_REQUESTS,
    async (movie) => [movie.title, await resolveMovieCoverUrlByTitle(movie)] as const,
  );

  return Object.fromEntries(entries);
};
