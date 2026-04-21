import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostHeader from './post-header';

jest.mock('isomorphic-dompurify', () => ({
  __esModule: true,
  default: { sanitize: (html: string) => html },
}));

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
  default: ({ dateString }: { dateString: string }) => (
    <time dateTime={dateString}>{dateString}</time>
  ),
}));

jest.mock('./cover-image', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => (
    <div data-testid="cover-image" aria-label={title} />
  ),
}));

jest.mock('./post-title', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <h1>{children}</h1>,
}));

const baseProps = {
  title: 'My Post Title',
  slug: 'my-post',
  date: '2023-01-15',
};

describe('PostHeader', () => {
  it('renders the post title as a link to the slug', () => {
    render(<PostHeader {...baseProps} />);
    const link = screen.getByRole('link', { name: 'My Post Title' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/my-post');
  });

  it('renders a "Posted" label and the date when date is provided', () => {
    render(<PostHeader {...baseProps} />);
    expect(screen.getByText(/Posted/)).toBeInTheDocument();
    expect(screen.getByText('2023-01-15')).toBeInTheDocument();
  });

  it('does not render the date section when date is omitted', () => {
    render(<PostHeader title="My Post" slug="my-post" />);
    expect(screen.queryByText(/Posted/)).not.toBeInTheDocument();
  });

  it('renders the cover image when provided', () => {
    const coverImage = {
      node: {
        sourceUrl: 'https://example.com/image.jpg',
        mediaDetails: { width: 800, height: 600, sizes: '', srcset: '' },
        caption: '',
      },
    };
    render(<PostHeader {...baseProps} coverImage={coverImage} />);
    expect(screen.getByTestId('cover-image')).toBeInTheDocument();
  });

  it('does not render a cover image when coverImage is omitted', () => {
    render(<PostHeader {...baseProps} />);
    expect(screen.queryByTestId('cover-image')).not.toBeInTheDocument();
  });

  it('renders a caption overlay when a caption string is provided alongside an image', () => {
    const coverImage = {
      node: {
        sourceUrl: 'https://example.com/image.jpg',
        mediaDetails: { width: 800, height: 600, sizes: '', srcset: '' },
        caption: '',
      },
    };
    render(<PostHeader {...baseProps} coverImage={coverImage} caption="Photo by James" />);
    expect(screen.getByText('Photo by James')).toBeInTheDocument();
  });
});
