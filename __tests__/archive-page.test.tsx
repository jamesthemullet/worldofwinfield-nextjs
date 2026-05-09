import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { ArchivePageProps } from '../lib/types';
import ArchivePage from '../pages/archive-page';

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

const mockPost = {
  id: '1',
  slug: 'test-post',
  title: 'Test Post',
  date: '2025-03-01',
  excerpt: '',
  content: '',
  featuredImage: null,
  seo: null,
  author: null,
  tags: { edges: [] },
  categories: { edges: [] },
};

const makeProps = (posts: (typeof mockPost)[]): ArchivePageProps =>
  ({ posts: { posts }, month: 3, year: 2025 }) as unknown as ArchivePageProps;

const defaultProps = makeProps([mockPost]);

describe('ArchivePage', () => {
  beforeEach(() => {
    mockRouter.isFallback = false;
  });

  it('renders the post header with the correct title when posts exist', () => {
    render(<ArchivePage {...defaultProps} />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('Archives Posts from March 2025');
  });

  it('renders a list of posts with correct links', () => {
    render(<ArchivePage {...defaultProps} />);
    const link = screen.getByRole('link', { name: 'Test Post' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test-post');
  });

  it('renders multiple posts', () => {
    const secondPost = { ...mockPost, id: '2', slug: 'second-post', title: 'Second Post' };
    render(<ArchivePage {...makeProps([mockPost, secondPost])} />);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
  });

  it('renders the header and no-posts message when there are no posts', () => {
    render(<ArchivePage {...makeProps([])} />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('Archives Posts from March 2025');
    expect(screen.getByText('No posts found for March 2025')).toBeInTheDocument();
  });

  it('does not render a post list when there are no posts', () => {
    render(<ArchivePage {...makeProps([])} />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders loading state when router.isFallback is true', () => {
    mockRouter.isFallback = true;
    render(<ArchivePage {...defaultProps} />);
    expect(screen.getByTestId('post-title')).toHaveTextContent('Loading…');
  });

  it('does not render the layout when loading', () => {
    mockRouter.isFallback = true;
    render(<ArchivePage {...defaultProps} />);
    expect(screen.queryByTestId('post-header')).not.toBeInTheDocument();
  });
});
