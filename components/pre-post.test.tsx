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
const exiledTag = { edges: [{ node: { name: 'ExiledToryRemainerScum' } }] };
const politicsTag = { edges: [{ node: { name: 'Politics' } }] };

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
    render(<PrePost tags={exiledTag} date="2023-01-01" />);
    expect(screen.getByText(/Originally posted on the now-defunct/)).toBeInTheDocument();
  });

  describe('Politics staleness note', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-01-01'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('shows staleness note for a Politics post more than 2 years old', () => {
      render(<PrePost tags={politicsTag} date="2020-01-01" />);
      expect(screen.getByText(/This post is \d+ years old/)).toBeInTheDocument();
    });

    it('does not show staleness note for a recent Politics post', () => {
      render(<PrePost tags={politicsTag} date="2025-06-01" />);
      expect(screen.queryByText(/This post is \d+ years old/)).not.toBeInTheDocument();
    });
  });
});
