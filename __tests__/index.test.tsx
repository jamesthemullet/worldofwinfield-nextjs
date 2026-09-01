import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import type { IndexPageProps } from '../lib/types';
import Index from '../pages/index';

jest.mock('../components/layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/intro', () => ({
  __esModule: true,
  default: () => <div data-testid="intro" />,
}));

jest.mock('../components/homepage-block', () => ({
  __esModule: true,
  default: ({ title, url, label }: { title?: string; url?: string | null; label?: string }) =>
    url ? (
      <a href={url}>
        {title}
        {label && <span data-testid="block-label">{label}</span>}
      </a>
    ) : (
      <span>{title}</span>
    ),
}));

jest.mock('../components/search-bar', () => ({
  __esModule: true,
  default: () => <div data-testid="search-bar" />,
}));

jest.mock('../components/search-results', () => ({
  __esModule: true,
  default: () => <div data-testid="search-results" />,
}));

const mockJamesImages = {
  edges: [
    {
      node: {
        title: 'James Image 1',
        featuredImage: {
          node: {
            mediaDetails: { height: 100, width: 100, sizes: '' },
            sourceUrl: '/james.jpg',
            srcset: '',
          },
        },
      },
    },
  ],
};

const mockFirstPost = {
  edges: [
    {
      node: {
        slug: 'my-first-post',
        title: 'My First Post',
        featuredImage: null,
        date: '2025-01-01',
        content: '',
        author: null,
        excerpt: '',
        seo: {
          opengraphDescription: '',
          opengraphTitle: 'My First Post',
          opengraphSiteName: 'World Of Winfield',
          opengraphImage: null,
        },
      },
    },
  ],
};

const mockRandomPosts = [
  { title: 'Random Post A', slug: 'random-post-a', date: '2024-06-01', featuredImage: null },
  { title: 'Random Post B', slug: 'random-post-b', date: '2023-06-01', featuredImage: null },
];

const makeProps = (overrides: Partial<IndexPageProps> = {}): IndexPageProps =>
  ({
    preview: false,
    jamesImages: mockJamesImages,
    firstPost: mockFirstPost,
    randomPosts: mockRandomPosts,
    randomImageSet: { images: null, randomMonth: 6, randomYear: 2023 },
    archivePost: null,
    ...overrides,
  }) as unknown as IndexPageProps;

describe('Index (homepage)', () => {
  it('renders navigation links for all main sections', () => {
    render(<Index {...makeProps()} />);

    expect(screen.getByRole('link', { name: 'all the blog' })).toHaveAttribute('href', '/blog');
    expect(screen.getByRole('link', { name: 'travel' })).toHaveAttribute('href', '/travel');
    expect(screen.getByRole('link', { name: 'music' })).toHaveAttribute('href', '/music');
    expect(screen.getByRole('link', { name: 'favourites' })).toHaveAttribute('href', '/favourites');
    expect(screen.getByRole('link', { name: 'goals' })).toHaveAttribute('href', '/goals');
    expect(screen.getByRole('link', { name: 'politics' })).toHaveAttribute('href', '/politics');
    expect(screen.getByRole('link', { name: 'want to do' })).toHaveAttribute('href', '/wants');
  });

  it('renders the first post as a block linked to its slug', () => {
    render(<Index {...makeProps()} />);

    expect(screen.getByRole('link', { name: /My First Post/ })).toHaveAttribute(
      'href',
      'my-first-post',
    );
  });

  it('renders the search bar and search results placeholder', () => {
    render(<Index {...makeProps()} />);

    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('search-results')).toBeInTheDocument();
  });

  it('renders the archive post block with a "years ago" label', () => {
    const archivePost: IndexPageProps['archivePost'] = {
      post: {
        title: 'Old Post From 2019',
        slug: 'old-post-2019',
        date: '2019-03-15',
        featuredImage: null,
      },
      yearsAgo: 6,
    };
    render(<Index {...makeProps({ archivePost })} />);

    expect(screen.getByRole('link', { name: /Old Post From 2019/ })).toHaveAttribute(
      'href',
      '/old-post-2019',
    );
    expect(screen.getByTestId('block-label')).toHaveTextContent('6 years ago');
  });
});
