import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import type { PostsProps } from '../lib/types';
import GoalsPage from '../pages/goals';

const mockRouter = { isFallback: false };

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
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

jest.mock('dompurify', () => ({
  __esModule: true,
  default: { sanitize: (html: string) => html },
}));

const mockPost = {
  id: '1',
  title: 'My Goals Post',
  excerpt: '<p>Working towards something great.</p>',
  date: '2025-06-01',
  slug: 'my-goals-post',
  featuredImage: null,
  tags: { edges: [] },
  seo: null,
  author: null,
  categories: { edges: [] },
} as unknown as PostsProps['posts'][0];

describe('GoalsPage', () => {
  beforeEach(() => {
    mockRouter.isFallback = false;
  });

  it('renders the loading state when router is falling back', () => {
    mockRouter.isFallback = true;
    render(<GoalsPage posts={[mockPost]} />);
    expect(screen.getByTestId('post-title')).toHaveTextContent('Loading…');
    expect(screen.queryByTestId('post-header')).not.toBeInTheDocument();
  });

  it('renders posts with a read-more link to the post slug', () => {
    render(<GoalsPage posts={[mockPost]} />);
    const link = screen.getByRole('link', { name: 'Read this post →' });
    expect(link).toHaveAttribute('href', '/my-goals-post');
  });

  it('renders the related sections for Now and Wants', () => {
    render(<GoalsPage posts={[mockPost]} />);
    expect(screen.getByTestId('related-sections')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Now' })).toHaveAttribute('href', '/now');
    expect(screen.getByRole('link', { name: 'Wants' })).toHaveAttribute('href', '/wants');
  });
});
