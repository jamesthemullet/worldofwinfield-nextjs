import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import TagsIndex from '../pages/tags/index';

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

jest.mock('../components/container', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/post-header', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="post-header">{title}</div>,
}));

const mockTags = [
  { name: 'JavaScript', count: 5 },
  { name: 'Travel', count: 1 },
  { name: 'C#', count: 3 },
];

describe('TagsIndex', () => {
  it('renders each tag name as a link with the correct href', () => {
    render(<TagsIndex tags={mockTags} />);

    const jsLink = screen.getByRole('link', { name: /JavaScript/i });
    expect(jsLink).toBeInTheDocument();
    expect(jsLink).toHaveAttribute('href', '/tags/JavaScript');

    const csharpLink = screen.getByRole('link', { name: /C#/i });
    expect(csharpLink).toHaveAttribute('href', `/tags/${encodeURIComponent('C#')}`);
  });

  it('shows singular "post" for a count of 1, and plural "posts" otherwise', () => {
    render(<TagsIndex tags={mockTags} />);

    expect(screen.getByText('5 posts')).toBeInTheDocument();
    expect(screen.getByText('1 post')).toBeInTheDocument();
    expect(screen.getByText('3 posts')).toBeInTheDocument();
  });

  it('renders the page heading', () => {
    render(<TagsIndex tags={mockTags} />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('Browse All Topics');
  });
});
