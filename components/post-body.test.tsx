import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostBody from './post-body';
import DOMPurify from 'isomorphic-dompurify';

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

jest.mock('isomorphic-dompurify', () => ({
  __esModule: true,
  default: {
    sanitize: jest.fn((html: string) => html),
    addHook: jest.fn(),
    removeHook: jest.fn(),
  },
}));

describe('PostBody', () => {
  it('renders provided HTML content', () => {
    render(<PostBody content="<p>Hello world</p>" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders multiple HTML elements from the content', () => {
    render(<PostBody content="<h1>Heading</h1><p>Paragraph</p>" />);
    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
  });

  it('renders without crashing for empty content', () => {
    const { container } = render(<PostBody content="" />);
    expect(container).toBeInTheDocument();
  });

  it('passes content through DOMPurify.sanitize with extended attributes', () => {
    render(<PostBody content="<p>Test content</p>" />);
    expect(DOMPurify.sanitize).toHaveBeenCalledWith(
      '<p>Test content</p>',
      expect.objectContaining({ ADD_ATTR: expect.arrayContaining(['srcset']) })
    );
  });
});
