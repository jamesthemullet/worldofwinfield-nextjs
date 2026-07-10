import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import type { YearInReviewIndexPageProps } from '../lib/types';
import YearInReviewIndex from '../pages/year-in-review/index';

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

jest.mock('../components/post-header', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="post-header">{title}</div>,
}));

const defaultProps: YearInReviewIndexPageProps = { years: [2025, 2024, 2018] };

describe('YearInReviewIndex', () => {
  it('renders the post header', () => {
    render(<YearInReviewIndex {...defaultProps} />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('Year in Review');
  });

  it('renders a tile for each year linking to its year-in-review page', () => {
    render(<YearInReviewIndex {...defaultProps} />);
    for (const year of defaultProps.years) {
      const link = screen.getByRole('link', { name: String(year) });
      expect(link).toHaveAttribute('href', `/year-in-review/${year}`);
    }
  });
});
