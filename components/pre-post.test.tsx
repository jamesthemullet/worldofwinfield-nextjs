import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrePost from './pre-post';

const noTags = { edges: [] };
const exiledTag = { edges: [{ node: { name: 'ExiledToryRemainerScum' } }] };
const politicsTag = { edges: [{ node: { name: 'Politics' } }] };

describe('PrePost', () => {
  it('displays reading time when content is provided', () => {
    render(<PrePost tags={noTags} date="2024-01-01" content="<p>Hello world</p>" />);
    expect(screen.getByText(/min read/)).toBeInTheDocument();
  });

  it('does not display reading time when content is not provided', () => {
    render(<PrePost tags={noTags} date="2024-01-01" />);
    expect(screen.queryByText(/min read/)).not.toBeInTheDocument();
  });

  it('shows a note for posts tagged ExiledToryRemainerScum', () => {
    render(<PrePost tags={exiledTag} date="2024-01-01" />);
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
      expect(screen.getByText(/politics have changed over time/)).toBeInTheDocument();
    });

    it('does not show staleness note for a recent Politics post', () => {
      render(<PrePost tags={politicsTag} date="2025-06-01" />);
      expect(screen.queryByText(/politics have changed over time/)).not.toBeInTheDocument();
    });
  });
});
