import { resolveArticleCovers } from './article-covers';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

describe('resolveArticleCovers', () => {
  it('returns the og:image URL when property precedes content in the meta tag', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => '<meta property="og:image" content="https://example.com/img.jpg">',
    }) as unknown as typeof fetch;

    const result = await resolveArticleCovers([
      { title: 'Test Article', link: 'https://example.com/article' },
    ]);

    expect(result['Test Article']).toBe('https://example.com/img.jpg');
  });

  it('returns the og:image URL when content precedes property in the meta tag', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => '<meta content="https://example.com/reverse.jpg" property="og:image">',
    }) as unknown as typeof fetch;

    const result = await resolveArticleCovers([
      { title: 'Reverse Article', link: 'https://example.com/article' },
    ]);

    expect(result['Reverse Article']).toBe('https://example.com/reverse.jpg');
  });

  it('returns null without fetching when the link is not an http(s) URL', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await resolveArticleCovers([
      { title: 'Data Entry Slip', link: 'Just the article title again' },
    ]);

    expect(result['Data Entry Slip']).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns null when the fetch response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;

    const result = await resolveArticleCovers([
      { title: 'Error Article', link: 'https://example.com/article' },
    ]);

    expect(result['Error Article']).toBeNull();
  });

  it('returns null and does not throw when fetch rejects', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('network error')) as unknown as typeof fetch;
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await resolveArticleCovers([
      { title: 'Network Error', link: 'https://example.com/article' },
    ]);

    expect(result['Network Error']).toBeNull();
  });

  it('resolves multiple articles and keys the result by title', async () => {
    global.fetch = jest.fn().mockImplementation(async (url: string) => ({
      ok: true,
      text: async () =>
        (url as string).includes('first')
          ? '<meta property="og:image" content="https://example.com/first.jpg">'
          : '<meta property="og:image" content="https://example.com/second.jpg">',
    })) as unknown as typeof fetch;

    const result = await resolveArticleCovers([
      { title: 'First', link: 'https://example.com/first' },
      { title: 'Second', link: 'https://example.com/second' },
    ]);

    expect(result['First']).toBe('https://example.com/first.jpg');
    expect(result['Second']).toBe('https://example.com/second.jpg');
  });
});
