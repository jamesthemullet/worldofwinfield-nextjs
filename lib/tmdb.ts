const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342';
const REQUEST_TIMEOUT_MS = 8000;

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

// Keyed by title so lookups survive sorting/filtering in the UI without needing
// the cover art to travel alongside each row.
export const resolveMovieCovers = async (
  movies: MovieCoverLookup[],
): Promise<Record<string, string | null>> => {
  const entries = await Promise.all(
    movies.map(async (movie) => [movie.title, await resolveMovieCoverUrlByTitle(movie)] as const),
  );

  return Object.fromEntries(entries);
};
