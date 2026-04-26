import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrePost from './pre-post';

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

const noTags = { edges: [] };

describe('PrePost', () => {
  it('shows reading time when content is provided', () => {
    // 201 words → Math.ceil(201/200) = 2 min read
    const content = Array(201).fill('word').join(' ');
    render(<PrePost tags={noTags} date="2023-01-01" content={content} />);
    expect(screen.getByText('2 min read')).toBeInTheDocument();
  });

  it('does not show reading time when content is absent', () => {
    render(<PrePost tags={noTags} date="2023-01-01" />);
    expect(screen.queryByText(/min read/)).not.toBeInTheDocument();
  });

  it('shows the ExiledToryRemainerScum note when the tag is present', () => {
    const tags = { edges: [{ node: { name: 'ExiledToryRemainerScum' } }] };
    render(<PrePost tags={tags} date="2023-01-01" />);
    expect(screen.getByText(/Originally posted on the now-defunct/)).toBeInTheDocument();
  });

  it('shows an age notice for a Politics post more than 2 years old', () => {
    const tags = { edges: [{ node: { name: 'Politics' } }] };
    render(<PrePost tags={tags} date="2020-01-01" />);
    expect(screen.getByText(/This post is \d+ years old/)).toBeInTheDocument();
  });

  it('does not show an age notice for a recent Politics post', () => {
    const recentYear = new Date().getFullYear();
    const tags = { edges: [{ node: { name: 'Politics' } }] };
    render(<PrePost tags={tags} date={`${recentYear}-01-01`} />);
    expect(screen.queryByText(/This post is \d+ years old/)).not.toBeInTheDocument();
  });
});
