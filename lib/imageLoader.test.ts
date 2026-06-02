import imageLoader from './imageLoader';

describe('imageLoader', () => {
  it('returns local paths unchanged', () => {
    const result = imageLoader({ src: '/images/photo.jpg', width: 800, quality: 75 });
    expect(result).toBe('/images/photo.jpg');
  });

  it('transforms external URLs to the Jetpack CDN format', () => {
    const result = imageLoader({
      src: 'https://example.com/uploads/photo.jpg',
      width: 600,
      quality: 80,
    });
    expect(result).toBe('https://i0.wp.com/example.com/uploads/photo.jpg?w=600&q=80&strip=all');
  });

  it('defaults quality to 75 when not provided', () => {
    const result = imageLoader({ src: 'https://example.com/uploads/photo.jpg', width: 400 });
    expect(result).toBe('https://i0.wp.com/example.com/uploads/photo.jpg?w=400&q=75&strip=all');
  });
});
