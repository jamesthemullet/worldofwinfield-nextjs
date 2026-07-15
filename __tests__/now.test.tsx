import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import NowPage from '../pages/now';

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

jest.mock('../components/share-bar', () => ({
  __esModule: true,
  default: () => <div data-testid="share-bar" />,
}));

jest.mock('../data/now-meta', () => ({
  NOW_LAST_UPDATED: 'April 2026',
}));

describe('NowPage', () => {
  it('renders the Now heading', () => {
    render(<NowPage />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('Now');
  });

  it('renders the last updated date from NOW_LAST_UPDATED', () => {
    render(<NowPage />);
    expect(screen.getByText(/Last updated:/)).toHaveTextContent('Last updated: April 2026');
  });

  it('renders all section headings', () => {
    render(<NowPage />);
    expect(screen.getByText(/Where I am/)).toBeInTheDocument();
    expect(screen.getByText(/What I'm working on/)).toBeInTheDocument();
    expect(screen.getByText(/What I'm learning/)).toBeInTheDocument();
    expect(screen.getByText(/What I'm reading/)).toBeInTheDocument();
    expect(screen.getByText(/What's next/)).toBeInTheDocument();
  });
});
