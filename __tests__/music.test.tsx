import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import type { PostsProps } from '../lib/types';
import MusicPage from '../pages/music';

const mockRouter = { isFallback: false };

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('next/error', () => ({
  __esModule: true,
  default: ({ statusCode }: { statusCode: number }) => (
    <div data-testid="error-page">Error {statusCode}</div>
  ),
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

jest.mock('../components/layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/container', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/post-header', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="post-header">{title}</div>,
}));

jest.mock('../components/post-title', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="post-title">{children}</div>
  ),
}));

jest.mock('../components/related-sections', () => ({
  __esModule: true,
  default: ({ sections }: { sections: { label: string; href: string; colour: string }[] }) => (
    <div data-testid="related-sections">
      {sections.map((s) => (
        <a key={s.href} href={s.href}>
          {s.label}
        </a>
      ))}
    </div>
  ),
}));

jest.mock('../lib/sanitize', () => ({
  sanitize: (html: string) => html,
}));

const mockPost = (n: number): PostsProps['posts'][0] =>
  ({
    id: String(n),
    title: `Music Post ${n}`,
    excerpt: `<p>Excerpt for post ${n}</p>`,
    date: '2025-01-01',
    slug: `music-post-${n}`,
    featuredImage: null,
    tags: { edges: [] },
    seo: null,
    author: null,
    categories: { edges: [] },
  }) as unknown as PostsProps['posts'][0];

describe('Music page (music.tsx)', () => {
  beforeEach(() => {
    mockRouter.isFallback = false;
  });

  it('renders the loading state when router is in fallback', () => {
    mockRouter.isFallback = true;
    render(<MusicPage posts={[mockPost(1)]} />);
    expect(screen.getByTestId('post-title')).toHaveTextContent('Loading…');
    expect(screen.queryByTestId('post-header')).not.toBeInTheDocument();
  });

  it('renders the 404 page when there are no posts', () => {
    render(<MusicPage posts={[]} />);
    expect(screen.getByTestId('error-page')).toBeInTheDocument();
  });

  it('renders each post with a read-more link to the correct slug', () => {
    render(<MusicPage posts={[mockPost(1), mockPost(2)]} />);
    const link1 = screen.getByRole('link', { name: 'Read more about Music Post 1' });
    const link2 = screen.getByRole('link', { name: 'Read more about Music Post 2' });
    expect(link1).toHaveAttribute('href', '/music-post-1');
    expect(link2).toHaveAttribute('href', '/music-post-2');
  });

  it('renders related sections for Favourite Tracks and Favourite DJs', () => {
    render(<MusicPage posts={[mockPost(1)]} />);
    expect(screen.getByTestId('related-sections')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Favourite Tracks' })).toHaveAttribute(
      'href',
      '/favourite-tracks',
    );
    expect(screen.getByRole('link', { name: 'Favourite DJs' })).toHaveAttribute(
      'href',
      '/favourite-djs',
    );
  });
});
