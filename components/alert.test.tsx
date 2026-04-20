import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Alert from './alert';

describe('Alert', () => {
  it('renders no preview message when preview is null', () => {
    render(<Alert preview={null} />);
    expect(screen.queryByText(/This is a page preview/)).not.toBeInTheDocument();
  });

  it('renders the preview message when preview is truthy', () => {
    render(<Alert preview="true" />);
    expect(screen.getByText(/This is a page preview/)).toBeInTheDocument();
  });

  it('renders an exit-preview link when in preview mode', () => {
    render(<Alert preview="true" />);
    const link = screen.getByRole('link', { name: /Click here/i });
    expect(link).toHaveAttribute('href', '/api/exit-preview');
  });

  it('does not render any links when not in preview mode', () => {
    render(<Alert preview={null} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders without error when preview is an empty string', () => {
    const { container } = render(<Alert preview="" />);
    expect(container).toBeInTheDocument();
    expect(screen.queryByText(/This is a page preview/)).not.toBeInTheDocument();
  });
});
