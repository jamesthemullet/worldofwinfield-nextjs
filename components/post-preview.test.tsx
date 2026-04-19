import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostPreview from './post-preview';
import { PostPreviewProps } from '../lib/types';

jest.mock('isomorphic-dompurify', () => ({
  __esModule: true,
  default: { sanitize: (html: string) => html },
}));

jest.mock('./post-header', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="post-header">{title}</div>,
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

const baseProps: PostPreviewProps = {
  title: 'Test Post Title',
  date: '2023-01-15',
  excerpt: '<p>This is an excerpt.</p>',
  author: {
    node: {
      name: 'James Winfield',
      firstName: 'James',
      lastName: 'Winfield',
      avatar: { url: '' },
      description: '',
    },
  },
  slug: 'test-post',
  featuredImage: {
    node: {
      sourceUrl: 'https://example.com/image.jpg',
      mediaDetails: { height: 100, width: 100, sizes: '', srcset: '' },
      caption: '',
    },
  },
  coverImage: {
    node: {
      sourceUrl: 'https://example.com/image.jpg',
      mediaDetails: { height: 100, width: 100, sizes: '', srcset: '' },
      caption: '',
    },
  },
};

describe('PostPreview', () => {
  it('renders the post title via PostHeader', () => {
    render(<PostPreview {...baseProps} />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('Test Post Title');
  });

  it('renders a "Read More" link', () => {
    render(<PostPreview {...baseProps} />);
    expect(screen.getByRole('link', { name: 'Read More' })).toBeInTheDocument();
  });

  it('"Read More" link href matches the post slug', () => {
    render(<PostPreview {...baseProps} />);
    expect(screen.getByRole('link', { name: 'Read More' })).toHaveAttribute('href', 'test-post');
  });

  it('renders the excerpt text content', () => {
    render(<PostPreview {...baseProps} excerpt="<p>My interesting excerpt.</p>" />);
    expect(screen.getByText('My interesting excerpt.')).toBeInTheDocument();
  });

  it('removes anchor links from the excerpt', () => {
    const excerptWithLink =
      '<p>Some text. <a href="https://example.com/read-more">Read more here</a></p>';
    render(<PostPreview {...baseProps} excerpt={excerptWithLink} />);
    expect(screen.queryByText('Read more here')).not.toBeInTheDocument();
    expect(screen.getByText(/Some text\./)).toBeInTheDocument();
  });

  it('preserves non-link text after link removal', () => {
    const excerptWithLink =
      '<p>Introduction. <a href="https://example.com">Link text</a> Conclusion.</p>';
    render(<PostPreview {...baseProps} excerpt={excerptWithLink} />);
    expect(screen.queryByText('Link text')).not.toBeInTheDocument();
    expect(screen.getByText(/Introduction\./)).toBeInTheDocument();
  });

});
