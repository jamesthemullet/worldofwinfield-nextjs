const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json';
const OPEN_LIBRARY_BOOKS_URL = 'https://openlibrary.org/api/books';
const REQUEST_TIMEOUT_MS = 8000;

type OpenLibraryBooksResponse = Record<string, { cover?: { medium?: string } } | undefined>;
type OpenLibrarySearchResponse = { docs?: Array<{ cover_i?: number }> };

export type BookCoverLookup = {
  title: string;
  author?: string;
  isbn?: string;
};

const normalizeIsbn = (isbn: string): string => isbn.replace(/[^0-9Xx]/g, '');

// A single batched request covers every ISBN in the list, which is both faster
// and far more reliable than covers.openlibrary.org's per-ISBN redirect, whose
// 404 behaviour is inconsistent for unknown ISBNs.
const fetchCoversByIsbn = async (isbns: string[]): Promise<Record<string, string | null>> => {
  if (isbns.length === 0) return {};

  try {
    const bibkeys = isbns.map((isbn) => `ISBN:${isbn}`).join(',');
    const params = new URLSearchParams({ bibkeys, format: 'json', jscmd: 'data' });

    const response = await fetch(`${OPEN_LIBRARY_BOOKS_URL}?${params.toString()}`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return {};

    const json = (await response.json()) as OpenLibraryBooksResponse;
    const coversByIsbn: Record<string, string | null> = {};

    for (const isbn of isbns) {
      const coverUrl = json?.[`ISBN:${isbn}`]?.cover?.medium;
      coversByIsbn[isbn] = typeof coverUrl === 'string' ? coverUrl : null;
    }

    return coversByIsbn;
  } catch (error) {
    console.error('Error resolving Open Library covers by ISBN:', error);
    return {};
  }
};

export const resolveBookCoverUrlByTitle = async ({
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

    const json = (await response.json()) as OpenLibrarySearchResponse;
    const coverId = json?.docs?.[0]?.cover_i;

    return typeof coverId === 'number'
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : null;
  } catch (error) {
    console.error('Error resolving Open Library cover:', error);
    return null;
  }
};

// Keyed by title so lookups survive sorting/filtering in the UI without needing
// the cover art to travel alongside each row. Prefers a direct ISBN lookup —
// far more precise than the title/author search — and falls back to the
// title/author search for rows with no ISBN or no ISBN match.
export const resolveBookCovers = async (
  books: BookCoverLookup[],
): Promise<Record<string, string | null>> => {
  const isbnsToLookup = Array.from(
    new Set(
      books
        .filter((book): book is BookCoverLookup & { isbn: string } => !!book.isbn)
        .map((book) => normalizeIsbn(book.isbn)),
    ),
  );
  const coversByIsbn = await fetchCoversByIsbn(isbnsToLookup);

  const entries = await Promise.all(
    books.map(async (book) => {
      const isbnCover = book.isbn ? coversByIsbn[normalizeIsbn(book.isbn)] : null;
      if (isbnCover) return [book.title, isbnCover] as const;

      return [book.title, await resolveBookCoverUrlByTitle(book)] as const;
    }),
  );

  return Object.fromEntries(entries);
};
