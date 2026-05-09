import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import SearchResults, { formatDate } from './search-results';

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

describe('formatDate', () => {
  it('adds "st" suffix for the 1st', () => {
    const result = formatDate('2023-03-01');
    expect(result).toContain('1st');
  });

  it('adds "nd" suffix for the 2nd', () => {
    const result = formatDate('2023-03-02');
    expect(result).toContain('2nd');
  });

  it('adds "rd" suffix for the 3rd', () => {
    const result = formatDate('2023-03-03');
    expect(result).toContain('3rd');
  });

  it('adds "th" suffix for the 4th through 10th', () => {
    expect(formatDate('2023-03-04')).toContain('4th');
    expect(formatDate('2023-03-10')).toContain('10th');
  });

  it('adds "th" suffix for the 11th (special case)', () => {
    expect(formatDate('2023-03-11')).toContain('11th');
  });

  it('adds "th" suffix for the 12th (special case)', () => {
    expect(formatDate('2023-03-12')).toContain('12th');
  });

  it('adds "th" suffix for the 13th (special case)', () => {
    expect(formatDate('2023-03-13')).toContain('13th');
  });

  it('adds "st" suffix for the 21st', () => {
    expect(formatDate('2023-03-21')).toContain('21st');
  });

  it('adds "nd" suffix for the 22nd', () => {
    expect(formatDate('2023-03-22')).toContain('22nd');
  });

  it('adds "rd" suffix for the 23rd', () => {
    expect(formatDate('2023-03-23')).toContain('23rd');
  });

  it('adds "th" suffix for the 31st day — 31 ends in 1 but is not 11, so gets "st"', () => {
    expect(formatDate('2023-03-31')).toContain('31st');
  });

  it('includes the year in the formatted date', () => {
    expect(formatDate('2021-06-15')).toContain('2021');
  });
});

describe('SearchResults', () => {
  it('renders nothing visible when searchResults is null', () => {
    const { container } = render(<SearchResults searchResults={null} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('renders "No results found." when searchResults is an empty array', () => {
    render(<SearchResults searchResults={[]} />);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('renders a list of results when searchResults has items', () => {
    const results = [
      { slug: 'post-one', title: 'Post One', date: '2023-01-15' },
      { slug: 'post-two', title: 'Post Two', date: '2023-06-20' },
    ];
    render(<SearchResults searchResults={results} />);
    expect(screen.getByText('Search results:')).toBeInTheDocument();
    expect(screen.getByText('Post One')).toBeInTheDocument();
    expect(screen.getByText('Post Two')).toBeInTheDocument();
  });

  it('renders a link to each result using its slug', () => {
    const results = [{ slug: 'my-post', title: 'My Post', date: '2023-01-15' }];
    render(<SearchResults searchResults={results} />);
    const link = screen.getByText('My Post').closest('a');
    expect(link).toHaveAttribute('href', '/my-post');
  });

  it('does not render "No results found." when results exist', () => {
    const results = [{ slug: 'post-one', title: 'Post One', date: '2023-01-15' }];
    render(<SearchResults searchResults={results} />);
    expect(screen.queryByText('No results found.')).not.toBeInTheDocument();
  });
});
