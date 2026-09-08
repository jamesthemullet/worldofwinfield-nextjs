import { render, screen } from '@testing-library/react';
import type { GetServerSidePropsContext } from 'next';
import React from 'react';
import '@testing-library/jest-dom';
import { performGlobalSearch } from '../lib/global-search';
import SearchPage, { getServerSideProps } from './search';

jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn(), asPath: '/search' }),
}));

jest.mock('../lib/global-search', () => ({
  performGlobalSearch: jest.fn(),
}));

const mockPerformGlobalSearch = performGlobalSearch as jest.Mock;

describe('SearchPage', () => {
  it('renders the query in the heading', () => {
    render(<SearchPage query="paris" searchResults={{ posts: [] }} />);
    expect(screen.getByRole('heading', { name: /paris/i })).toBeInTheDocument();
  });

  it('shows a no-results message when nothing matches', () => {
    render(<SearchPage query="zzz" searchResults={{ posts: [] }} />);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('renders matching posts', () => {
    render(
      <SearchPage
        query="barcelona"
        searchResults={{
          posts: [{ slug: 'barcelona-trip', title: 'Barcelona Trip', date: '2023-01-01' }],
        }}
      />,
    );
    expect(screen.getByText('Barcelona Trip')).toBeInTheDocument();
  });
});

describe('getServerSideProps', () => {
  beforeEach(() => {
    mockPerformGlobalSearch.mockReset();
  });

  it('calls performGlobalSearch with the q query param and returns it as props', async () => {
    mockPerformGlobalSearch.mockResolvedValue({ posts: [] });

    const context = { query: { q: 'radiohead' } } as unknown as GetServerSidePropsContext;
    const result = await getServerSideProps(context);

    expect(mockPerformGlobalSearch).toHaveBeenCalledWith('radiohead');
    expect('props' in result && result.props).toEqual({
      query: 'radiohead',
      searchResults: { posts: [] },
    });
  });

  it('skips searching and returns empty results when q is missing', async () => {
    const context = { query: {} } as unknown as GetServerSidePropsContext;
    const result = await getServerSideProps(context);

    expect(mockPerformGlobalSearch).not.toHaveBeenCalled();
    expect('props' in result && result.props).toEqual({
      query: '',
      searchResults: { posts: [] },
    });
  });
});
