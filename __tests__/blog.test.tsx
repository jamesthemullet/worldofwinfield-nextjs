import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import type { IndexPageProps } from '../lib/types';
import BlogPage from '../pages/blog';

jest.mock('next/router', () => ({
  useRouter: () => ({ isFallback: false }),
}));

jest.mock('../components/layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/container', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/hero-post', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="hero-post">{title}</div>,
}));

jest.mock('../components/more-stories', () => ({
  __esModule: true,
  default: ({ posts }: { posts: { node: { title: string; slug: string } }[] }) => (
    <ul data-testid="more-stories">
      {posts.map((p) => (
        <li key={p.node.slug}>{p.node.title}</li>
      ))}
    </ul>
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

const mockAuthor = {
  node: {
    name: 'James Winfield',
    firstName: 'James',
    lastName: 'Winfield',
    avatar: { url: '/avatar.jpg' },
    description: 'Writer',
  },
};

const mockSeo = {
  opengraphDescription: 'A blog',
  opengraphImage: null,
  opengraphTitle: 'Blog',
  opengraphSiteName: 'World Of Winfield',
};

const makePost = (n: number) => ({
  node: {
    slug: `post-${n}`,
    title: `Post ${n}`,
    featuredImage: {
      node: {
        sourceUrl: `/image-${n}.jpg`,
        mediaDetails: { height: 100, width: 100, sizes: '', srcset: '' },
        caption: '',
      },
    },
    date: '2024-01-01T00:00:00',
    content: `<p>Content ${n}</p>`,
    author: mockAuthor,
    excerpt: `Excerpt ${n}`,
    seo: mockSeo,
  },
});

const makeAllPosts = (count: number, hasNextPage = false, endCursor: string | null = null) => ({
  edges: Array.from({ length: count }, (_, i) => makePost(i + 1)),
  pageInfo: { hasNextPage, endCursor },
});

const makeProps = (
  count: number,
  hasNextPage = false,
  endCursor: string | null = null,
): IndexPageProps =>
  ({
    allPosts: makeAllPosts(count, hasNextPage, endCursor),
    preview: false,
  }) as unknown as IndexPageProps;

describe('Blog page (blog.tsx)', () => {
  it('renders the hero post from the first post in the list', () => {
    render(<BlogPage {...makeProps(3)} />);
    expect(screen.getByTestId('hero-post')).toHaveTextContent('Post 1');
  });

  it('renders MoreStories for all posts after the first', () => {
    render(<BlogPage {...makeProps(3)} />);
    const moreStories = screen.getByTestId('more-stories');
    expect(moreStories).toBeInTheDocument();
    expect(screen.getByText('Post 2')).toBeInTheDocument();
    expect(screen.getByText('Post 3')).toBeInTheDocument();
    expect(screen.queryByText('Post 1', { selector: 'li' })).not.toBeInTheDocument();
  });

  it('does not render MoreStories when there is only one post', () => {
    render(<BlogPage {...makeProps(1)} />);
    expect(screen.queryByTestId('more-stories')).not.toBeInTheDocument();
  });

  it('shows the Load More button when hasNextPage is true', () => {
    render(<BlogPage {...makeProps(2, true, 'cursor1')} />);
    expect(screen.getByRole('button', { name: 'Load more' })).toBeInTheDocument();
  });

  it('hides the Load More button when hasNextPage is false', () => {
    render(<BlogPage {...makeProps(2, false)} />);
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument();
  });

  it('shows "Loading..." on the button while more posts are being fetched', async () => {
    global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));
    render(<BlogPage {...makeProps(2, true, 'cursor1')} />);
    fireEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(await screen.findByRole('button', { name: 'Loading...' })).toBeInTheDocument();
  });

  it('appends loaded posts after clicking Load More', async () => {
    const newPosts = { edges: [makePost(3)], pageInfo: { hasNextPage: false, endCursor: null } };
    global.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(newPosts) });
    render(<BlogPage {...makeProps(2, true, 'cursor1')} />);
    fireEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(await screen.findByText('Post 3')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument();
  });

  it('renders navigation links for topics, year in review, and RSS', () => {
    render(<BlogPage {...makeProps(1)} />);
    expect(screen.getByRole('link', { name: /Browse all topics/ })).toHaveAttribute(
      'href',
      '/tags',
    );
    expect(screen.getByRole('link', { name: /Year in Review/ })).toHaveAttribute(
      'href',
      '/year-in-review',
    );
    expect(screen.getByRole('link', { name: 'Subscribe via RSS' })).toHaveAttribute(
      'href',
      '/api/feed',
    );
  });

  it('renders the search bar and search results', () => {
    render(<BlogPage {...makeProps(1)} />);
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('search-results')).toBeInTheDocument();
  });
});
