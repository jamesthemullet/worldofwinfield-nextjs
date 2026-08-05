import { resolveBookCovers, resolveBookCoverUrlByTitle } from './open-library';

describe('resolveBookCoverUrlByTitle', () => {
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

    const url = await resolveBookCoverUrlByTitle({ title: 'Dune', author: 'Frank Herbert' });

    expect(url).toBe('https://covers.openlibrary.org/b/id/12345-M.jpg');
  });

  it('includes the author in the query string when provided', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ docs: [{ cover_i: 1 }] }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await resolveBookCoverUrlByTitle({ title: 'Dune', author: 'Frank Herbert' });

    const requestedUrl = fetchMock.mock.calls[0][0] as string;
    expect(requestedUrl).toContain('title=Dune');
    expect(requestedUrl).toContain('author=Frank+Herbert');
  });

  it('returns null when no docs are found', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ docs: [] }),
    }) as unknown as typeof fetch;

    const url = await resolveBookCoverUrlByTitle({ title: 'Some Unknown Book' });

    expect(url).toBeNull();
  });

  it('returns null when the response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;

    const url = await resolveBookCoverUrlByTitle({ title: 'Dune' });

    expect(url).toBeNull();
  });

  it('returns null and does not throw when fetch rejects', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('network error')) as unknown as typeof fetch;

    const url = await resolveBookCoverUrlByTitle({ title: 'Dune' });

    expect(url).toBeNull();
  });

  it('returns null without calling fetch when title is empty', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const url = await resolveBookCoverUrlByTitle({ title: '' });

    expect(url).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('resolveBookCovers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('resolves covers for multiple books via a single batched ISBN request', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        'ISBN:9781841154336': { cover: { medium: 'https://covers.openlibrary.org/b/id/1-M.jpg' } },
        'ISBN:9780552771894': { cover: { medium: 'https://covers.openlibrary.org/b/id/2-M.jpg' } },
      }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const covers = await resolveBookCovers([
      { title: 'Dune', isbn: '978-1-84115-433-6' },
      { title: 'Neuromancer', isbn: '978-0-552-77189-4' },
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const requestedUrl = fetchMock.mock.calls[0][0] as string;
    expect(requestedUrl).toContain('bibkeys=ISBN%3A9781841154336%2CISBN%3A9780552771894');
    expect(covers.Dune).toBe('https://covers.openlibrary.org/b/id/1-M.jpg');
    expect(covers.Neuromancer).toBe('https://covers.openlibrary.org/b/id/2-M.jpg');
  });

  it('falls back to title/author search when the ISBN has no cover', async () => {
    global.fetch = jest.fn().mockImplementation(async (url: string) => {
      if (url.includes('api/books')) {
        return { ok: true, json: async () => ({ 'ISBN:123': {} }) };
      }
      return { ok: true, json: async () => ({ docs: [{ cover_i: 42 }] }) };
    }) as unknown as typeof fetch;

    const covers = await resolveBookCovers([{ title: 'Neuromancer', isbn: '123' }]);

    expect(covers.Neuromancer).toBe('https://covers.openlibrary.org/b/id/42-M.jpg');
  });

  it('falls back to title/author search when there is no ISBN', async () => {
    global.fetch = jest.fn().mockImplementation(async (url: string) => {
      if (url.includes('api/books')) {
        throw new Error('should not be called with no ISBNs');
      }
      return { ok: true, json: async () => ({ docs: [] }) };
    }) as unknown as typeof fetch;

    const covers = await resolveBookCovers([{ title: 'Unknown Book' }]);

    expect(covers['Unknown Book']).toBeNull();
  });
});
