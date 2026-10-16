/**
 * @jest-environment node
 */
import { sanitize } from './sanitize';

describe('sanitize (no browser window, e.g. getStaticProps/SSG)', () => {
  it('strips script tags from unsafe HTML instead of returning it unchanged', () => {
    expect(typeof window).toBe('undefined');

    const html = '<p>Safe text</p><script>alert("xss")</script>';
    const result = sanitize(html);

    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
    expect(result).toContain('Safe text');
  });

  it('still keeps Getty embed scripts when a caller opts in via ADD_TAGS', () => {
    const html =
      "<a class='gie-single' href='https://www.gettyimages.com/detail/123'>Embed from Getty Images</a>" +
      '<script>window.gie=window.gie||function(c){(window.gie.q=window.gie.q||[]).push(c)};</script>' +
      '<script src="https://embed-cdn.gettyimages.com/widgets.js" async charset="utf-8"></script>';

    const result = sanitize(html, { ADD_TAGS: ['script'], ADD_ATTR: ['async', 'charset'] });

    expect(result).toContain('window.gie');
    expect(result).toContain('embed-cdn.gettyimages.com/widgets.js');
  });
});
