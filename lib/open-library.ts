const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json';
const OPEN_LIBRARY_COVERS_URL = 'https://covers.openlibrary.org/b/id';
const REQUEST_TIMEOUT_MS = 5000;

export type BookCoverLookup = {
  title: string;
  author?: string;
};

export const resolveBookCoverUrl = async ({
  title,
  author,
}: BookCoverLookup): Promise<string | null> => {
  if (!title) return null;

  try {
    const params = new URLSearchParams({ title, limit: '1', fields: 'cover_i' });
    if (author) params.set('author', author);

    const response = await fetch(`${OPEN_LIBRARY_SEARCH_URL}?${params.toString()}`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return null;

    const json = await response.json();
    const coverId = json?.docs?.[0]?.cover_i;

    return typeof coverId === 'number' ? `${OPEN_LIBRARY_COVERS_URL}/${coverId}-M.jpg` : null;
  } catch (error) {
    console.error('Error resolving Open Library cover:', error);
    return null;
  }
};

// Keyed by title so lookups survive sorting/filtering in the UI without needing
// the cover art to travel alongside each row.
export const resolveBookCovers = async (
  books: BookCoverLookup[],
): Promise<Record<string, string | null>> => {
  const entries = await Promise.all(
    books.map(async (book) => [book.title, await resolveBookCoverUrl(book)] as const),
  );

  return Object.fromEntries(entries);
};
