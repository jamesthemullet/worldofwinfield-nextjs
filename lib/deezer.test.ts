import { resolveArtistCovers, resolveArtistCoverUrlByTitle } from './deezer';

describe('resolveArtistCoverUrlByTitle', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('returns a picture_medium URL when an artist is found', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ picture_medium: 'https://cdn-images.dzcdn.net/abc.jpg' }] }),
    }) as unknown as typeof fetch;

    const url = await resolveArtistCoverUrlByTitle({ title: 'Ricardo Villalobos' });

    expect(url).toBe('https://cdn-images.dzcdn.net/abc.jpg');
  });

  it('sends the title as the search query', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ picture_medium: 'https://cdn-images.dzcdn.net/abc.jpg' }] }),
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
            data: [{ picture_medium: 'https://cdn-images.dzcdn.net/mrg.jpg' }],
          }),
        };
      }
      return { ok: true, json: async () => ({ data: [] }) };
    }) as unknown as typeof fetch;

    const covers = await resolveArtistCovers([{ title: 'Mr G' }, { title: 'Unknown DJ' }]);

    expect(covers['Mr G']).toBe('https://cdn-images.dzcdn.net/mrg.jpg');
    expect(covers['Unknown DJ']).toBeNull();
  });
});
