import { stripReadMoreParagraph } from '../pages/tags/[tag]';

describe('stripReadMoreParagraph', () => {
  it('removes anchor tags from excerpt HTML', () => {
    const input = '<p>Some text.</p> <a href="/read-more" class="btn">Read More</a>';
    expect(stripReadMoreParagraph(input)).toBe('<p>Some text.</p>');
  });

  it('returns the string unchanged when there are no anchor tags', () => {
    const input = '<p>Just some content here.</p>';
    expect(stripReadMoreParagraph(input)).toBe('<p>Just some content here.</p>');
  });
});
