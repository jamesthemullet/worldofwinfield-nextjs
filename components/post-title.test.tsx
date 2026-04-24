import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostTitle from './post-title';

jest.mock('dompurify', () => ({
  __esModule: true,
  default: { sanitize: (html: string) => html },
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

describe('PostTitle', () => {
  it('renders the title text in an h1', () => {
    render(<PostTitle>Hello World</PostTitle>);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Hello World');
  });

  it('renders an h1 element', () => {
    render(<PostTitle>My Post Title</PostTitle>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders plain HTML tags like <em> in the title', () => {
    render(<PostTitle>{'My <em>Great</em> Post'}</PostTitle>);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.querySelector('em')).toBeInTheDocument();
    expect(heading).toHaveTextContent('My Great Post');
  });

  it('renders correctly without a backgroundColour prop', () => {
    render(<PostTitle>No Background</PostTitle>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('No Background');
  });
});
