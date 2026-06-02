import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import PostNavigation from './post-navigation';

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

describe('PostNavigation', () => {
  it('renders nothing when both previousPost and nextPost are null', () => {
    const { container } = render(<PostNavigation previousPost={null} nextPost={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the previous post link with direction label and title', () => {
    const previousPost = { title: 'Older Post Title', slug: 'older-post' };
    render(<PostNavigation previousPost={previousPost} nextPost={null} />);

    expect(screen.getByText('← Older')).toBeInTheDocument();
    expect(screen.getByText('Older Post Title')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/older-post');
  });

  it('renders the next post link with direction label and title', () => {
    const nextPost = { title: 'Newer Post Title', slug: 'newer-post' };
    render(<PostNavigation previousPost={null} nextPost={nextPost} />);

    expect(screen.getByText('Newer →')).toBeInTheDocument();
    expect(screen.getByText('Newer Post Title')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/newer-post');
  });
});
