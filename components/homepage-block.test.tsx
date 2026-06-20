import { render, screen } from '@testing-library/react';
import React from 'react';
import HomepageBlock from './homepage-block';

jest.mock('../pages/_app', () => ({
  colours: {
    pink: '#D90368',
    green: '#04A777',
    purple: '#8884FF',
    burgandy: '#820263',
    dark: '#291720',
    azure: '#3185FC',
    blueish: '#547AA5',
    white: '#FFFFFF',
  },
}));

jest.mock('./search-results', () => ({
  formatDate: (date: string) => `Formatted: ${date}`,
}));

const jamesImages = {
  edges: [
    {
      node: {
        title: 'Test James Image',
        featuredImage: {
          node: {
            sourceUrl: 'https://example.com/james.jpg',
            srcset: '',
            mediaDetails: { height: 100, width: 100, sizes: '' },
          },
        },
      },
    },
  ],
};

const baseProps = {
  title: 'Test Post',
  url: '/test-post',
  size: 1,
  jamesImages,
};

describe('HomepageBlock', () => {
  it('renders a link with the correct aria-label and href when url is provided', () => {
    render(<HomepageBlock {...baseProps} />);
    expect(screen.getByRole('link', { name: 'Test Post' })).toHaveAttribute('href', '/test-post');
  });

  it('renders a label badge when the label prop is provided', () => {
    render(<HomepageBlock {...baseProps} label="New" />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders title text and formatted date when date and url are provided', () => {
    render(<HomepageBlock {...baseProps} date="2024-01-15" />);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Formatted: 2024-01-15')).toBeInTheDocument();
  });

  it('hides title text but shows date when title is "random photo"', () => {
    render(<HomepageBlock {...baseProps} title="random photo" date="2024-01-15" />);
    expect(screen.queryByText('random photo')).not.toBeInTheDocument();
    expect(screen.getByText('Formatted: 2024-01-15')).toBeInTheDocument();
  });

  it('renders title text inside the link when icon prop is provided', () => {
    render(<HomepageBlock {...baseProps} icon="music" />);
    expect(screen.getByRole('link', { name: 'Test Post' })).toHaveAttribute('href', '/test-post');
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });
});
