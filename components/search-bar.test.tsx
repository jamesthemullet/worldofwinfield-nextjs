import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from './search-bar';
import { searchBlogPosts } from '../lib/api';

jest.mock('../lib/api', () => ({
  searchBlogPosts: jest.fn(),
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

const mockSearchBlogPosts = searchBlogPosts as jest.MockedFunction<typeof searchBlogPosts>;

describe('SearchBar', () => {
  beforeEach(() => {
    mockSearchBlogPosts.mockReset();
  });

  it('renders the search input with placeholder text', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByPlaceholderText('Search blog...')).toBeInTheDocument();
  });

  it('renders the submit button with label "Search"', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('updates the input value as the user types', () => {
    render(<SearchBar onSearch={() => {}} />);
    const input = screen.getByPlaceholderText('Search blog...');
    fireEvent.change(input, { target: { value: 'test query' } });
    expect(input).toHaveValue('test query');
  });

  it('shows "Searching..." on the button while the search is in progress', async () => {
    let resolveSearch: (value: never[]) => void;
    mockSearchBlogPosts.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSearch = resolve;
        }),
    );

    render(<SearchBar onSearch={() => {}} />);
    const form = screen.getByRole('button', { name: 'Search' }).closest('form')!;
    fireEvent.submit(form);

    expect(await screen.findByText('Searching...')).toBeInTheDocument();

    resolveSearch!([]);
  });

  it('calls onSearch with the API results after form submission', async () => {
    const mockResults = [
      { slug: 'post-one', title: 'Post One', date: '2023-01-15' },
      { slug: 'post-two', title: 'Post Two', date: '2023-06-20' },
    ];
    mockSearchBlogPosts.mockResolvedValue(mockResults);

    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Search blog...');
    fireEvent.change(input, { target: { value: 'post' } });

    const form = input.closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith(mockResults, 'post');
    });
  });

  it('passes the current query value to searchBlogPosts', async () => {
    mockSearchBlogPosts.mockResolvedValue([]);
    render(<SearchBar onSearch={() => {}} />);

    const input = screen.getByPlaceholderText('Search blog...');
    fireEvent.change(input, { target: { value: 'hello world' } });

    const form = input.closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockSearchBlogPosts).toHaveBeenCalledWith('hello world');
    });
  });

  it('restores the "Search" button label after the search completes', async () => {
    mockSearchBlogPosts.mockResolvedValue([]);
    render(<SearchBar onSearch={() => {}} />);

    const form = screen.getByRole('button', { name: 'Search' }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    });
  });
});
