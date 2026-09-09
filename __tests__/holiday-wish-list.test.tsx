import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import WishListPage from '../pages/holiday-wish-list';

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

const sampleData = [
  ['Name', 'Country'],
  ['San Sebastian', 'Spain'],
  ['Kyoto', 'Japan'],
];

const coverArtByTitle = {
  'San Sebastian': null,
  Kyoto: null,
};

describe('WishListPage', () => {
  beforeEach(() => {
    mockRouter.isFallback = false;
  });

  it('renders the loading state when router is falling back', () => {
    mockRouter.isFallback = true;
    render(<WishListPage data={sampleData} coverArtByTitle={coverArtByTitle} />);
    expect(screen.getByTestId('post-title')).toHaveTextContent('Loading…');
    expect(screen.queryByTestId('post-header')).not.toBeInTheDocument();
  });

  it('renders the page header with the wish list title', () => {
    render(<WishListPage data={sampleData} coverArtByTitle={coverArtByTitle} />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('Holiday Wish List');
  });

  it('renders a sort dropdown with Name and Country options', () => {
    render(<WishListPage data={sampleData} coverArtByTitle={coverArtByTitle} />);
    const select = screen.getByLabelText('Sort by:');
    expect(select).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Country' })).toBeInTheDocument();
  });

  it('renders the wish list entries', () => {
    render(<WishListPage data={sampleData} coverArtByTitle={coverArtByTitle} />);
    expect(screen.getByText('San Sebastian')).toBeInTheDocument();
    expect(screen.getByText('Kyoto')).toBeInTheDocument();
  });

  it('sorts entries by the selected column', () => {
    render(<WishListPage data={sampleData} coverArtByTitle={coverArtByTitle} />);

    const select = screen.getByLabelText('Sort by:');
    fireEvent.change(select, { target: { value: 'Country' } });

    const cardTitles = screen.getAllByText(/San Sebastian|Kyoto/).map((el) => el.textContent);
    expect(cardTitles).toEqual(['Kyoto', 'San Sebastian']);
  });

  it('renders nothing for the wish list when data is null', () => {
    render(<WishListPage data={null} coverArtByTitle={{}} />);
    expect(screen.queryByText('San Sebastian')).not.toBeInTheDocument();
  });
});
