import { resolveMovieCovers, resolveMovieCoverUrlByTitle } from './tmdb';

describe('resolveMovieCoverUrlByTitle', () => {
  const originalFetch = global.fetch;
  const originalApiKey = process.env.TMDB_API_KEY;

  beforeEach(() => {
    process.env.TMDB_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.TMDB_API_KEY = originalApiKey;
    jest.restoreAllMocks();
  });

  it('returns an image.tmdb.org URL when a poster_path is found', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{ poster_path: '/abc123.jpg' }] }),
    }) as unknown as typeof fetch;

    const url = await resolveMovieCoverUrlByTitle({ title: 'Dune' });

    expect(url).toBe('https://image.tmdb.org/t/p/w342/abc123.jpg');
  });

  it('includes the year in the query string when provided', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{ poster_path: '/abc.jpg' }] }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await resolveMovieCoverUrlByTitle({ title: 'Dune', year: '2021' });

    const requestedUrl = fetchMock.mock.calls[0][0] as string;
    expect(requestedUrl).toContain('query=Dune');
    expect(requestedUrl).toContain('year=2021');
  });

  it('returns null when no results are found', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    }) as unknown as typeof fetch;

    const url = await resolveMovieCoverUrlByTitle({ title: 'Some Unknown Movie' });

    expect(url).toBeNull();
  });

  it('returns null when the response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;

    const url = await resolveMovieCoverUrlByTitle({ title: 'Dune' });

    expect(url).toBeNull();
  });

  it('returns null and does not throw when fetch rejects', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('network error')) as unknown as typeof fetch;

    const url = await resolveMovieCoverUrlByTitle({ title: 'Dune' });

    expect(url).toBeNull();
  });

  it('returns null without calling fetch when title is empty', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const url = await resolveMovieCoverUrlByTitle({ title: '' });

    expect(url).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns null without calling fetch when no API key is configured', async () => {
    delete process.env.TMDB_API_KEY;
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const url = await resolveMovieCoverUrlByTitle({ title: 'Dune' });

    expect(url).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('resolveMovieCovers', () => {
  const originalFetch = global.fetch;
  const originalApiKey = process.env.TMDB_API_KEY;

  beforeEach(() => {
    process.env.TMDB_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.TMDB_API_KEY = originalApiKey;
    jest.restoreAllMocks();
  });

  it('resolves covers for multiple movies keyed by title', async () => {
    global.fetch = jest.fn().mockImplementation(async (url: string) => {
      if (url.includes('query=Dune')) {
        return { ok: true, json: async () => ({ results: [{ poster_path: '/dune.jpg' }] }) };
      }
      return { ok: true, json: async () => ({ results: [] }) };
    }) as unknown as typeof fetch;

    const covers = await resolveMovieCovers([{ title: 'Dune' }, { title: 'Unknown Movie' }]);

    expect(covers.Dune).toBe('https://image.tmdb.org/t/p/w342/dune.jpg');
    expect(covers['Unknown Movie']).toBeNull();
  });
});
