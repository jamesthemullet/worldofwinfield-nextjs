import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import Custom404 from './404';

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

describe('Custom404', () => {
  it('renders the page not found message', () => {
    render(<Custom404 />);
    expect(screen.getByText('The page you are looking for does not exist.')).toBeInTheDocument();
  });

  it('renders a link back to the homepage', () => {
    render(<Custom404 />);
    const link = screen.getByRole('link', { name: 'Go back to the homepage' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders all four words in the decorative grid', () => {
    render(<Custom404 />);
    expect(screen.getByText('Why')).toBeInTheDocument();
    expect(screen.getByText('are')).toBeInTheDocument();
    expect(screen.getByText('you')).toBeInTheDocument();
    expect(screen.getByText('here?')).toBeInTheDocument();
  });
});
