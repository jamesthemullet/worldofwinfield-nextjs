import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tags from './tags';

describe('Tags', () => {
  it('renders all single-word tags', () => {
    const tags = {
      edges: [
        { node: { name: 'react' } },
        { node: { name: 'nextjs' } },
        { node: { name: 'typescript' } },
      ],
    };
    render(<Tags tags={tags} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('nextjs')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('filters out tags that contain a space', () => {
    const tags = {
      edges: [
        { node: { name: 'react' } },
        { node: { name: 'next js' } },
        { node: { name: 'type script' } },
      ],
    };
    render(<Tags tags={tags} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.queryByText('next js')).not.toBeInTheDocument();
    expect(screen.queryByText('type script')).not.toBeInTheDocument();
  });

  it('renders no tag links when all tags have spaces', () => {
    const tags = {
      edges: [
        { node: { name: 'web development' } },
        { node: { name: 'open source' } },
      ],
    };
    render(<Tags tags={tags} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders a link with the correct href for each tag', () => {
    const tags = {
      edges: [{ node: { name: 'javascript' } }],
    };
    render(<Tags tags={tags} />);
    const link = screen.getByRole('link', { name: 'javascript' });
    expect(link).toHaveAttribute('href', '/tags/javascript');
  });

  it('URL-encodes special characters in tag hrefs', () => {
    const tags = {
      edges: [{ node: { name: 'c++' } }],
    };
    render(<Tags tags={tags} />);
    const link = screen.getByRole('link', { name: 'c++' });
    expect(link).toHaveAttribute('href', `/tags/${encodeURIComponent('c++')}`);
  });

  it('renders the "Tagged:" label', () => {
    const tags = {
      edges: [{ node: { name: 'react' } }],
    };
    render(<Tags tags={tags} />);
    expect(screen.getByText(/Tagged:/)).toBeInTheDocument();
  });

  it('renders commas between tags but not after the last one', () => {
    const tags = {
      edges: [
        { node: { name: 'react' } },
        { node: { name: 'typescript' } },
      ],
    };
    const { container } = render(<Tags tags={tags} />);
    const spans = container.querySelectorAll('span');
    // First span should have a comma separator, last should not
    expect(spans[0].textContent).toContain(',');
    expect(spans[spans.length - 1].textContent).not.toContain(',');
  });
});
