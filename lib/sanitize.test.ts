import DOMPurify from 'dompurify';
import { sanitize } from './sanitize';

jest.mock('dompurify', () => ({
  __esModule: true,
  default: {
    sanitize: jest.fn((html: string) => html),
  },
}));

describe('sanitize', () => {
  beforeEach(() => {
    (DOMPurify.sanitize as jest.Mock).mockClear();
  });

  it('delegates to DOMPurify.sanitize and returns its output', () => {
    (DOMPurify.sanitize as jest.Mock).mockReturnValueOnce('clean html');
    const result = sanitize('<b>input</b>');
    expect(DOMPurify.sanitize).toHaveBeenCalledWith('<b>input</b>', undefined);
    expect(result).toBe('clean html');
  });

  it('forwards an optional config object to DOMPurify.sanitize', () => {
    const config = { ALLOWED_TAGS: ['b'] };
    sanitize('<b>bold</b>', config);
    expect(DOMPurify.sanitize).toHaveBeenCalledWith('<b>bold</b>', config);
  });
});

describe('sanitize with real DOMPurify', () => {
  // Import the real module (not the jest.mock above) to exercise the Getty script hook.
  let realSanitize: typeof import('./sanitize.js').sanitize;

  beforeAll(async () => {
    jest.resetModules();
    jest.unmock('dompurify');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    ({ sanitize: realSanitize } = require('./sanitize'));
  });

  it('keeps Getty embed scripts when a caller opts in via ADD_TAGS', () => {
    const html =
      "<a class='gie-single' href='https://www.gettyimages.com/detail/123'>Embed from Getty Images</a>" +
      '<script>window.gie=window.gie||function(c){(window.gie.q=window.gie.q||[]).push(c)};</script>' +
      '<script src="https://embed-cdn.gettyimages.com/widgets.js" async charset="utf-8"></script>';

    const result = realSanitize(html, { ADD_TAGS: ['script'], ADD_ATTR: ['async', 'charset'] });

    expect(result).toContain('window.gie');
    expect(result).toContain('embed-cdn.gettyimages.com/widgets.js');
  });

  it('strips scripts that are not Getty embeds even when a caller opts in via ADD_TAGS', () => {
    const html = '<script>alert("xss")</script>';
    const result = realSanitize(html, { ADD_TAGS: ['script'] });
    expect(result).not.toContain('script');
    expect(result).not.toContain('alert');
  });

  it('strips scripts by default when a caller does not opt in via ADD_TAGS', () => {
    const html = '<script src="https://embed-cdn.gettyimages.com/widgets.js"></script><p>Text</p>';
    const result = realSanitize(html);
    expect(result).not.toContain('script');
    expect(result).toContain('Text');
  });
});
