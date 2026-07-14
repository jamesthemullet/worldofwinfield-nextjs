import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import type { YearInReviewProps } from '../lib/types';
import YearInReview from '../pages/year-in-review/[year]';

const mockRouter = { isFallback: false };

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
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

jest.mock('../components/cover-image', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="cover-image">{title}</div>,
}));

jest.mock('../components/date', () => ({
  __esModule: true,
  default: ({ dateString }: { dateString: string }) => <span>{dateString}</span>,
}));

const mockPost = {
  id: '1',
  slug: 'test-post',
  title: 'Test Post',
  date: '2025-03-01',
  excerpt: '<p>A test excerpt</p>',
  featuredImage: undefined,
};

const makeProps = (posts: (typeof mockPost)[], year = 2025): YearInReviewProps =>
  ({ posts, year }) as unknown as YearInReviewProps;

const defaultProps = makeProps([mockPost]);

describe('YearInReview', () => {
  beforeEach(() => {
    mockRouter.isFallback = false;
  });

  it('renders the post header with the correct title', () => {
    render(<YearInReview {...defaultProps} />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('2025 Year in Review');
  });

  it('renders the post count', () => {
    render(<YearInReview {...defaultProps} />);
    expect(screen.getByText('1 post written in 2025')).toBeInTheDocument();
  });

  it('renders a list of posts with correct links', () => {
    render(<YearInReview {...defaultProps} />);
    const link = screen.getByRole('link', { name: 'Test Post' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test-post');
  });

  it('renders multiple posts', () => {
    const secondPost = { ...mockPost, id: '2', slug: 'second-post', title: 'Second Post' };
    render(<YearInReview {...makeProps([mockPost, secondPost])} />);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
    expect(screen.getByText('2 posts written in 2025')).toBeInTheDocument();
  });

  it('renders a no-posts message when there are no posts', () => {
    render(<YearInReview {...makeProps([])} />);
    expect(screen.getByText('No posts found for 2025')).toBeInTheDocument();
    expect(screen.getByText('0 posts written in 2025')).toBeInTheDocument();
  });

  it('links to the previous and next year, but not beyond the first year or the current year', () => {
    render(<YearInReview {...makeProps([mockPost], 2018)} />);
    expect(screen.queryByRole('link', { name: /← 2017/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /2019 →/ })).toBeInTheDocument();
  });

  it('renders a link back to all years', () => {
    render(<YearInReview {...defaultProps} />);
    expect(screen.getByRole('link', { name: 'All years' })).toHaveAttribute(
      'href',
      '/year-in-review',
    );
  });

  it('renders loading state when router.isFallback is true', () => {
    mockRouter.isFallback = true;
    render(<YearInReview {...defaultProps} />);
    expect(screen.getByTestId('post-title')).toHaveTextContent('Loading…');
  });

  it('does not render the post header when loading', () => {
    mockRouter.isFallback = true;
    render(<YearInReview {...defaultProps} />);
    expect(screen.queryByTestId('post-header')).not.toBeInTheDocument();
  });
});
