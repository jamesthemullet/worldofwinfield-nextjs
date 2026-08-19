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

jest.mock('../components/core-components', () => ({
  StyledButton: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

const visitData: string[][] = [
  ['Name', 'Country'],
  ['Kyoto', 'Japan'],
];
const eatData: string[][] = [
  ['Restaurant Name', 'Cuisine'],
  ['Nobu', 'Japanese'],
];

describe('WantsPage', () => {
  beforeEach(() => {
    mockRouter.isFallback = false;
  });

  it('renders the "I want..." heading', () => {
    render(<WantsPage wantToVisitData={visitData} wantToEatData={eatData} />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('I want...');
  });

  it('shows the loading state when router is falling back', () => {
    mockRouter.isFallback = true;
    render(<WantsPage wantToVisitData={visitData} wantToEatData={eatData} />);
    expect(screen.getByTestId('post-title')).toHaveTextContent('Loading…');
    expect(screen.queryByTestId('post-header')).not.toBeInTheDocument();
  });

  it('shows visit data when "Want To Visit" is clicked', () => {
    render(<WantsPage wantToVisitData={visitData} wantToEatData={eatData} />);
    expect(screen.queryByTestId('favourite-results')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Want To Visit' }));
    expect(screen.getByTestId('favourite-results')).toBeInTheDocument();
  });

  it('switches to eat data when "Want To Eat Here" is clicked', () => {
    render(<WantsPage wantToVisitData={visitData} wantToEatData={eatData} />);
    fireEvent.click(screen.getByRole('button', { name: 'Want To Eat Here' }));
    expect(screen.getByTestId('favourite-results')).toBeInTheDocument();
  });
});
