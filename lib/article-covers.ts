const REQUEST_TIMEOUT_MS = 8000;
// Scraping dozens of arbitrary third-party sites at build time - be conservative
// about how many are in flight at once so one slow host doesn't stall the rest.
const MAX_CONCURRENT_REQUESTS = 5;

const OG_IMAGE_PATTERN =
  /<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>|<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image["'][^>]*>/i;

export type ArticleCoverLookup = {
  title: string;
  link?: string;
};

const isHttpUrl = (value: string | undefined): value is string => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// The sheet's Link column is sometimes just the article title again (data-entry
// slip), so links that don't parse as an http(s) URL are skipped rather than
// fetched.
const resolveArticleCoverUrl = async (link: string | undefined): Promise<string | null> => {
  if (!isHttpUrl(link)) return null;

  try {
    const response = await fetch(link, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorldOfWinfieldBot/1.0)' },
    });
    if (!response.ok) return null;

    const html = await response.text();
    const match = html.match(OG_IMAGE_PATTERN);
    const imageUrl = match?.[1] ?? match?.[2];

    return isHttpUrl(imageUrl) ? imageUrl : null;
  } catch (error) {
    console.error(`Error resolving og:image for ${link}:`, error);
    return null;
  }
};

// Runs `fn` over `items` with at most `limit` in flight at once.
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
export const resolveArticleCovers = async (
  articles: ArticleCoverLookup[],
): Promise<Record<string, string | null>> => {
  const entries = await mapWithConcurrency(
    articles,
    MAX_CONCURRENT_REQUESTS,
    async (article) => [article.title, await resolveArticleCoverUrl(article.link)] as const,
  );

  return Object.fromEntries(entries);
};
