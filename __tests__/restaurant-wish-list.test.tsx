import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import WishListPage from '../pages/restaurant-wish-list';

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
    <div data-testid="favourite-results">{JSON.stringify(data)}</div>
  ),
}));

const sampleData = [
  ['Name', 'Cuisine'],
  ['Dishoom', 'Indian'],
  ['Padella', 'Italian'],
];

describe('WishListPage (restaurant-wish-list)', () => {
  beforeEach(() => {
    mockRouter.isFallback = false;
  });

  it('renders the loading state when router is falling back', () => {
    mockRouter.isFallback = true;
    render(<WishListPage data={sampleData} />);
    expect(screen.getByTestId('post-title')).toHaveTextContent('Loading…');
    expect(screen.queryByTestId('post-header')).not.toBeInTheDocument();
  });

  it('renders the page header with the restaurant wish list title', () => {
    render(<WishListPage data={sampleData} />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('Restaurant Wish List');
  });

  it('passes the sheet data through to FavouriteResults', () => {
    render(<WishListPage data={sampleData} />);
    expect(screen.getByTestId('favourite-results')).toHaveTextContent('Dishoom');
    expect(screen.getByTestId('favourite-results')).toHaveTextContent('Padella');
  });

  it('renders FavouriteResults with null data without crashing', () => {
    render(<WishListPage data={null} />);
    expect(screen.getByTestId('favourite-results')).toHaveTextContent('null');
  });
});
