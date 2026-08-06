import { resolveArtistCovers, resolveArtistCoverUrlByTitle } from './deezer';

describe('resolveArtistCoverUrlByTitle', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('returns a picture_medium URL when the top match name equals the query', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          { name: 'Ricardo Villalobos', picture_medium: 'https://cdn-images.dzcdn.net/abc.jpg' },
        ],
      }),
    }) as unknown as typeof fetch;

    const url = await resolveArtistCoverUrlByTitle({ title: 'Ricardo Villalobos' });

    expect(url).toBe('https://cdn-images.dzcdn.net/abc.jpg');
  });

  it('matches ignoring case, diacritics and punctuation', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ name: 'babyschon', picture_medium: 'https://cdn-images.dzcdn.net/abc.jpg' }],
      }),
    }) as unknown as typeof fetch;

    const url = await resolveArtistCoverUrlByTitle({ title: 'babyschön' });

    expect(url).toBe('https://cdn-images.dzcdn.net/abc.jpg');
  });

  it('skips a top result whose name does not match the query, even if lower candidates would', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          { name: 'Babyshambles', picture_medium: 'https://cdn-images.dzcdn.net/wrong.jpg' },
          { name: 'Some Other Artist', picture_medium: 'https://cdn-images.dzcdn.net/other.jpg' },
        ],
      }),
    }) as unknown as typeof fetch;

    const url = await resolveArtistCoverUrlByTitle({ title: 'babyschön' });

    expect(url).toBeNull();
  });

  it('rejects a near-miss name like "Herodote" for a query of "Herodot"', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ name: 'Herodote', picture_medium: 'https://cdn-images.dzcdn.net/wrong.jpg' }],
      }),
    }) as unknown as typeof fetch;

    const url = await resolveArtistCoverUrlByTitle({ title: 'Herodot' });

    expect(url).toBeNull();
  });

  it('sends the title as the search query', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ name: 'Mr G', picture_medium: 'https://cdn-images.dzcdn.net/abc.jpg' }],
      }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await resolveArtistCoverUrlByTitle({ title: 'Mr G' });

    const requestedUrl = fetchMock.mock.calls[0][0] as string;
    expect(requestedUrl).toContain('q=Mr+G');
  });

  it('returns null when no results are found', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    }) as unknown as typeof fetch;

    const url = await resolveArtistCoverUrlByTitle({ title: 'Some Unknown DJ' });

    expect(url).toBeNull();
  });

  it('returns null when the response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;

    const url = await resolveArtistCoverUrlByTitle({ title: 'Mr G' });

    expect(url).toBeNull();
  });

  it('returns null and does not throw when fetch rejects', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('network error')) as unknown as typeof fetch;

    const url = await resolveArtistCoverUrlByTitle({ title: 'Mr G' });

    expect(url).toBeNull();
  });

  it('returns null without calling fetch when title is empty', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const url = await resolveArtistCoverUrlByTitle({ title: '' });

    expect(url).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('resolveArtistCovers', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('resolves covers for multiple artists keyed by title', async () => {
    global.fetch = jest.fn().mockImplementation(async (url: string) => {
      if (url.includes('q=Mr+G')) {
        return {
          ok: true,
          json: async () => ({
            data: [{ name: 'Mr G', picture_medium: 'https://cdn-images.dzcdn.net/mrg.jpg' }],
          }),
        };
      }
      return { ok: true, json: async () => ({ data: [] }) };
    }) as unknown as typeof fetch;

    const covers = await resolveArtistCovers([{ title: 'Mr G' }, { title: 'Unknown DJ' }]);

    expect(covers['Mr G']).toBe('https://cdn-images.dzcdn.net/mrg.jpg');
    expect(covers['Unknown DJ']).toBeNull();
  });

  it('paces requests so a large batch does not fire faster than the rate limit allows', async () => {
    const callTimes: number[] = [];
    global.fetch = jest.fn().mockImplementation(async () => {
      callTimes.push(Date.now());
      return { ok: true, json: async () => ({ data: [] }) };
    }) as unknown as typeof fetch;

    const artists = Array.from({ length: 10 }, (_, i) => ({ title: `DJ ${i}` }));
    await resolveArtistCovers(artists);

    expect(callTimes).toHaveLength(10);
    const span = callTimes[callTimes.length - 1] - callTimes[0];
    // 10 requests across 4 workers means the busiest worker makes 3 calls,
    // each spaced >=120ms apart, so the batch can't finish near-instantly.
    expect(span).toBeGreaterThanOrEqual(100);
  });
});
