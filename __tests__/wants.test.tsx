import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import WantsPage from '../pages/wants';

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

jest.mock('../pages/favourites-results', () => ({
  __esModule: true,
  default: ({ data }: { data: string[][] | null }) => (
    <div data-testid="favourite-results">{data ? data.length : 0} rows</div>
  ),
}));

const visitData: string[][] = [
  ['Name', 'Country'],
  ['Iceland', 'Iceland'],
  ['Japan', 'Japan'],
];

const eatData: string[][] = [
  ['Name', 'City'],
  ['Noma', 'Copenhagen'],
];

describe('Wants page (wants.tsx)', () => {
  beforeEach(() => {
    mockRouter.isFallback = false;
  });

  it('renders the loading state when router is in fallback', () => {
    mockRouter.isFallback = true;
    render(<WantsPage wantToVisitData={visitData} wantToEatData={eatData} />);
    expect(screen.getByTestId('post-title')).toHaveTextContent('Loading…');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders "Want To Visit" and "Want To Eat Here" buttons', () => {
    render(<WantsPage wantToVisitData={visitData} wantToEatData={eatData} />);
    expect(screen.getByRole('button', { name: 'Want To Visit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Want To Eat Here' })).toBeInTheDocument();
  });

  it('shows visit results when "Want To Visit" is clicked', () => {
    render(<WantsPage wantToVisitData={visitData} wantToEatData={eatData} />);
    expect(screen.queryByTestId('favourite-results')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Want To Visit' }));
    expect(screen.getByTestId('favourite-results')).toBeInTheDocument();
    expect(screen.getByTestId('favourite-results')).toHaveTextContent('3 rows');
  });

  it('shows eat results when "Want To Eat Here" is clicked', () => {
    render(<WantsPage wantToVisitData={visitData} wantToEatData={eatData} />);
    fireEvent.click(screen.getByRole('button', { name: 'Want To Eat Here' }));
    expect(screen.getByTestId('favourite-results')).toHaveTextContent('2 rows');
  });
});
