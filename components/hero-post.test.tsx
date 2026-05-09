import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { HeroPostProps } from '../lib/types';
import HeroPost from './hero-post';

jest.mock('dompurify', () => ({
  __esModule: true,
  default: { sanitize: (html: string) => html },
}));

jest.mock('./post-header', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="post-header">{title}</div>,
}));

jest.mock('./core-components', () => ({
  StyledButton: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const baseProps: HeroPostProps = {
  title: 'Hero Post Title',
  date: '2023-01-15',
  excerpt: '<p>This is the excerpt.</p>',
  slug: 'hero-post-slug',
  author: {
    node: {
      name: 'James Winfield',
      firstName: 'James',
      lastName: 'Winfield',
      avatar: { url: '' },
      description: '',
    },
  },
  featuredImage: {
    node: {
      sourceUrl: 'https://example.com/image.jpg',
      mediaDetails: { height: 600, width: 800, sizes: '', srcset: '' },
      caption: '',
    },
  },
};

describe('HeroPost', () => {
  it('renders the PostHeader', () => {
    render(<HeroPost {...baseProps} />);
    expect(screen.getByTestId('post-header')).toBeInTheDocument();
  });

  it('passes the title to PostHeader', () => {
    render(<HeroPost {...baseProps} />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('Hero Post Title');
  });

  it('renders a "Read More" link', () => {
    render(<HeroPost {...baseProps} />);
    expect(screen.getByRole('link', { name: 'Read More' })).toBeInTheDocument();
  });

  it('"Read More" link points to the post slug', () => {
    render(<HeroPost {...baseProps} />);
    expect(screen.getByRole('link', { name: 'Read More' })).toHaveAttribute(
      'href',
      'hero-post-slug',
    );
  });

  it('renders the excerpt text', () => {
    render(<HeroPost {...baseProps} excerpt="<p>My interesting excerpt.</p>" />);
    expect(screen.getByText('My interesting excerpt.')).toBeInTheDocument();
  });

  it('strips external anchor links from the excerpt', () => {
    const excerptWithLink = '<p>Some text. <a href="https://external.com">External Link</a></p>';
    render(<HeroPost {...baseProps} excerpt={excerptWithLink} />);
    expect(screen.queryByText('External Link')).not.toBeInTheDocument();
    expect(screen.getByText(/Some text\./)).toBeInTheDocument();
  });

  it('preserves non-external-link text after stripping', () => {
    const excerptWithLink =
      '<p>Intro. <a href="https://example.com">Click here</a> Conclusion.</p>';
    render(<HeroPost {...baseProps} excerpt={excerptWithLink} />);
    expect(screen.queryByText('Click here')).not.toBeInTheDocument();
    expect(screen.getByText(/Intro\./)).toBeInTheDocument();
  });
});
