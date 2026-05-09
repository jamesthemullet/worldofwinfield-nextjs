import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import CoverImage from './cover-image';

const coverImageData = {
  node: {
    sourceUrl: 'https://example.com/image.jpg',
    mediaDetails: {
      width: 800,
      height: 600,
      sizes: '(max-width: 768px) 100vw, 50vw',
      srcset: 'https://example.com/image-400.jpg 400w',
    },
  },
};

describe('CoverImage', () => {
  it('renders no image when coverImage is not provided', () => {
    render(<CoverImage title="Test Post" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders an image when coverImage with a sourceUrl is provided', () => {
    render(<CoverImage title="Test Post" coverImage={coverImageData} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('sets the alt text to include the post title', () => {
    render(<CoverImage title="My Post Title" coverImage={coverImageData} />);
    expect(screen.getByAltText('Cover Image for My Post Title')).toBeInTheDocument();
  });

  it('wraps the image in a link to the post when slug is provided', () => {
    render(<CoverImage title="Test Post" coverImage={coverImageData} slug="test-post" />);
    const link = screen.getByRole('link', { name: 'Test Post' });
    expect(link).toHaveAttribute('href', '/test-post');
  });

  it('does not render a link when no slug is provided', () => {
    render(<CoverImage title="Test Post" coverImage={coverImageData} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('loads the image eagerly when heroPost is true', () => {
    render(<CoverImage title="Test Post" coverImage={coverImageData} heroPost />);
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'eager');
  });

  it('loads the image lazily by default', () => {
    render(<CoverImage title="Test Post" coverImage={coverImageData} />);
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
  });
});
