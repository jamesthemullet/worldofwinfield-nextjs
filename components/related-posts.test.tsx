import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RelatedPosts from './related-posts';
import { RelatedPost } from '../lib/types';

jest.mock('../pages/_app', () => ({
  colours: {
    dark: '#291720',
    white: '#FFFFFF',
    pink: '#D90368',
    purple: '#8884FF',
    burgandy: '#820263',
    green: '#04A777',
    blueish: '#547AA5',
    azure: '#3185FC',
  },
}));

jest.mock('./date', () => ({
  __esModule: true,
  default: ({ dateString }: { dateString: string }) => <time>{dateString}</time>,
}));

const mockPosts: RelatedPost[] = [
  {
    title: 'Related Post One',
    slug: 'related-post-one',
    date: '2023-01-15',
    excerpt: '<p>Excerpt one</p>',
    featuredImage: {
      node: {
        sourceUrl: 'https://example.com/image1.jpg',
        mediaDetails: { height: 250, width: 400 },
        srcSet: 'https://example.com/image1.jpg 400w',
      },
    },
  },
  {
    title: 'Related Post Two',
    slug: 'related-post-two',
    date: '2023-06-20',
    excerpt: '<p>Excerpt two</p>',
    featuredImage: null,
  },
];

describe('RelatedPosts', () => {
  it('renders nothing when posts is empty', () => {
    const { container } = render(<RelatedPosts posts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the "You might also like" heading', () => {
    render(<RelatedPosts posts={mockPosts} />);
    expect(screen.getByRole('heading', { name: 'You might also like' })).toBeInTheDocument();
  });

  it('renders links to each post using its slug', () => {
    render(<RelatedPosts posts={mockPosts} />);
    // Each post with an image has two links (image + title), both pointing to the same slug
    const linksToFirst = screen.getAllByRole('link', { name: 'Related Post One' });
    expect(linksToFirst.length).toBeGreaterThan(0);
    linksToFirst.forEach((link) => expect(link).toHaveAttribute('href', '/related-post-one'));

    // Second post has no image so only the title link
    expect(screen.getByRole('link', { name: 'Related Post Two' })).toHaveAttribute(
      'href',
      '/related-post-two'
    );
  });

  it('renders each post title', () => {
    render(<RelatedPosts posts={mockPosts} />);
    expect(screen.getByText('Related Post One')).toBeInTheDocument();
    expect(screen.getByText('Related Post Two')).toBeInTheDocument();
  });

  it('renders dates for each post', () => {
    render(<RelatedPosts posts={mockPosts} />);
    expect(screen.getByText('2023-01-15')).toBeInTheDocument();
    expect(screen.getByText('2023-06-20')).toBeInTheDocument();
  });

  it('renders an image for posts that have a featured image', () => {
    render(<RelatedPosts posts={mockPosts} />);
    expect(screen.getByAltText('Related Post One')).toBeInTheDocument();
  });

  it('does not crash when a post has no featured image', () => {
    render(<RelatedPosts posts={[mockPosts[1]]} />);
    expect(screen.getByText('Related Post Two')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
