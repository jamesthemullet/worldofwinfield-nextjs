import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { JamesImagesProps } from '../lib/types';
import HomepageBlock from './homepage-block';

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

jest.mock('./search-results', () => ({
  formatDate: (date: string) => date,
}));

const mockJamesImages: JamesImagesProps = {
  edges: [
    {
      node: {
        title: 'james image',
        featuredImage: {
          node: {
            mediaDetails: { height: 100, width: 100, sizes: '' },
            sourceUrl: 'https://example.com/james.jpg',
            srcset: '',
          },
        },
      },
    },
  ],
};

describe('HomepageBlock', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the icon image when icon prop is provided', () => {
    const { container } = render(
      <HomepageBlock
        title="Music"
        url="/music"
        size={2}
        jamesImages={mockJamesImages}
        icon="004-record"
      />,
    );
    expect(container.querySelector('img')).toHaveAttribute('src', '/icons/004-record.png');
  });

  it('renders a link with the correct aria-label and href when url is provided', () => {
    render(
      <HomepageBlock
        title="Latest Post"
        url="/latest-post"
        size={1}
        jamesImages={mockJamesImages}
        image={{ node: { sourceUrl: 'https://example.com/post.jpg' } }}
      />,
    );
    expect(screen.getByRole('link', { name: 'Latest Post' })).toHaveAttribute(
      'href',
      '/latest-post',
    );
  });

  it('shows a label badge when the label prop is provided', () => {
    render(
      <HomepageBlock
        title="Old Post"
        url="/old-post"
        size={2}
        jamesImages={mockJamesImages}
        label="5 years ago"
      />,
    );
    expect(screen.getByText('5 years ago')).toBeInTheDocument();
  });

  it('does not show a label badge when label prop is omitted', () => {
    render(
      <HomepageBlock
        title="Recent Post"
        url="/recent-post"
        size={2}
        jamesImages={mockJamesImages}
      />,
    );
    expect(screen.queryByText(/years ago/)).not.toBeInTheDocument();
  });

  it('renders the post title and date in the overlay when both url and date are provided', () => {
    render(
      <HomepageBlock
        title="My Blog Post"
        url="/my-blog-post"
        size={3}
        date="2023-01-15"
        jamesImages={mockJamesImages}
        image={{ node: { sourceUrl: 'https://example.com/post.jpg' } }}
      />,
    );
    expect(screen.getByText('My Blog Post')).toBeInTheDocument();
    expect(screen.getByText('2023-01-15')).toBeInTheDocument();
  });
});
