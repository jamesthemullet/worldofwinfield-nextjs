import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import StatsPage from '../pages/stats';

const mockRouter = { isFallback: false };

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
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

const defaultProps = {
  countriesVisited: 42,
  totalCountries: 195,
  continentsVisited: 5,
  books: 30,
  beers: 100,
  movies: 50,
  djs: 20,
  cheese: 15,
  restaurants: 45,
  tracks: 80,
  articles: 60,
  cities: 35,
  favouriteCountries: 10,
  totalPosts: 150,
};

describe('StatsPage', () => {
  beforeEach(() => {
    mockRouter.isFallback = false;
  });

  it('renders the loading state when router is falling back', () => {
    mockRouter.isFallback = true;
    render(<StatsPage {...defaultProps} />);
    expect(screen.getByTestId('post-title')).toHaveTextContent('Loading…');
    expect(screen.queryByTestId('post-header')).not.toBeInTheDocument();
  });

  it('renders the James Stats heading and all section titles', () => {
    render(<StatsPage {...defaultProps} />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('James Stats');
    expect(screen.getByRole('heading', { name: 'Travel' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Blog' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Reading & Culture' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Food & Drink' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Music' })).toBeInTheDocument();
  });

  it('renders stat labels and a non-zero post count', () => {
    render(<StatsPage {...defaultProps} />);
    expect(screen.getByText('countries visited')).toBeInTheDocument();
    expect(screen.getByText('posts published')).toBeInTheDocument();
    expect(screen.getByText('150+')).toBeInTheDocument();
  });
});
