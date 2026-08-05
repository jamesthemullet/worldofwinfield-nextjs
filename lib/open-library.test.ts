import { resolveBookCovers, resolveBookCoverUrl } from './open-library';

describe('resolveBookCoverUrl', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('returns a covers.openlibrary.org URL when a cover_i is found', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ docs: [{ cover_i: 12345 }] }),
    }) as unknown as typeof fetch;

    const url = await resolveBookCoverUrl({ title: 'Dune', author: 'Frank Herbert' });

    expect(url).toBe('https://covers.openlibrary.org/b/id/12345-M.jpg');
  });

  it('includes the author in the query string when provided', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ docs: [{ cover_i: 1 }] }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await resolveBookCoverUrl({ title: 'Dune', author: 'Frank Herbert' });

    const requestedUrl = fetchMock.mock.calls[0][0] as string;
    expect(requestedUrl).toContain('title=Dune');
    expect(requestedUrl).toContain('author=Frank+Herbert');
  });

  it('returns null when no docs are found', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ docs: [] }),
    }) as unknown as typeof fetch;

    const url = await resolveBookCoverUrl({ title: 'Some Unknown Book' });

    expect(url).toBeNull();
  });

  it('returns null when the response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;

    const url = await resolveBookCoverUrl({ title: 'Dune' });

    expect(url).toBeNull();
  });

  it('returns null and does not throw when fetch rejects', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('network error')) as unknown as typeof fetch;

    const url = await resolveBookCoverUrl({ title: 'Dune' });

    expect(url).toBeNull();
  });

  it('returns null without calling fetch when title is empty', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const url = await resolveBookCoverUrl({ title: '' });

    expect(url).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('resolveBookCovers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('resolves a map of title to cover URL', async () => {
    global.fetch = jest.fn().mockImplementation(async (url: string) => {
      if (url.includes('Dune')) {
        return { ok: true, json: async () => ({ docs: [{ cover_i: 1 }] }) };
      }
      return { ok: true, json: async () => ({ docs: [] }) };
    }) as unknown as typeof fetch;

    const covers = await resolveBookCovers([{ title: 'Dune' }, { title: 'Unknown Book' }]);

    expect(covers).toEqual({
      Dune: 'https://covers.openlibrary.org/b/id/1-M.jpg',
      'Unknown Book': null,
    });
  });
});
