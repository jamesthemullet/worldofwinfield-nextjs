import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MoreStories from './more-stories';
import { MoreStoriesProps } from '../lib/types';

jest.mock('./post-preview', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="post-preview">{title}</div>,
}));

const author = {
  node: {
    name: 'James Winfield',
    firstName: 'James',
    lastName: 'Winfield',
    avatar: { url: '' },
    description: '',
  },
};

const makeFeaturedImage = (url: string) => ({
  node: {
    sourceUrl: url,
    mediaDetails: { height: 100, width: 100, sizes: '', srcset: '' },
    caption: '',
  },
});

const mockPosts: MoreStoriesProps['posts'] = [
  {
    node: {
      slug: 'first-post',
      title: 'First Post',
      featuredImage: makeFeaturedImage('https://example.com/image1.jpg'),
      date: '2023-01-15',
      author,
      content: '<p>Content 1</p>',
      excerpt: '<p>Excerpt 1</p>',
    },
  },
  {
    node: {
      slug: 'second-post',
      title: 'Second Post',
      featuredImage: makeFeaturedImage('https://example.com/image2.jpg'),
      date: '2023-02-20',
      author,
      content: '<p>Content 2</p>',
      excerpt: '<p>Excerpt 2</p>',
    },
  },
];

describe('MoreStories', () => {
  it('renders one PostPreview per post', () => {
    render(<MoreStories posts={mockPosts} />);
    expect(screen.getAllByTestId('post-preview')).toHaveLength(2);
  });

  it('passes the post title to each PostPreview', () => {
    render(<MoreStories posts={mockPosts} />);
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
  });

  it('renders no PostPreviews when posts is empty', () => {
    render(<MoreStories posts={[]} />);
    expect(screen.queryByTestId('post-preview')).not.toBeInTheDocument();
  });
});
