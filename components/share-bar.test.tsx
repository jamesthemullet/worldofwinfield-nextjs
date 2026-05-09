import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import ShareBar from './share-bar';

const mockWriteText = jest.fn().mockResolvedValue(undefined);
Object.assign(navigator, {
  clipboard: { writeText: mockWriteText },
});

const defaultProps = {
  title: 'My Blog Post',
  url: 'https://worldofwinfield.co.uk/my-blog-post',
};

describe('ShareBar', () => {
  beforeEach(() => {
    mockWriteText.mockClear();
  });

  it('renders the share label', () => {
    render(<ShareBar {...defaultProps} />);
    expect(screen.getByText('Share this post:')).toBeInTheDocument();
  });

  it('renders the Bluesky share link with correct href', () => {
    render(<ShareBar {...defaultProps} />);
    const blueskyLink = screen.getByRole('link', { name: /share on bluesky/i });
    expect(blueskyLink).toHaveAttribute(
      'href',
      `https://bsky.app/intent/compose?text=${encodeURIComponent(defaultProps.title)}%20${encodeURIComponent(defaultProps.url)}`,
    );
    expect(blueskyLink).toHaveAttribute('target', '_blank');
    expect(blueskyLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the Threads share link with correct href', () => {
    render(<ShareBar {...defaultProps} />);
    const threadsLink = screen.getByRole('link', { name: /share on threads/i });
    expect(threadsLink).toHaveAttribute(
      'href',
      `https://www.threads.net/intent/post?text=${encodeURIComponent(defaultProps.title)}%20${encodeURIComponent(defaultProps.url)}`,
    );
    expect(threadsLink).toHaveAttribute('target', '_blank');
    expect(threadsLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the copy link button', () => {
    render(<ShareBar {...defaultProps} />);
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument();
  });

  it('copies URL to clipboard and shows Copied! confirmation when button clicked', async () => {
    render(<ShareBar {...defaultProps} />);
    const copyButton = screen.getByRole('button', { name: /copy link/i });
    fireEvent.click(copyButton);
    expect(mockWriteText).toHaveBeenCalledWith(defaultProps.url);
    await waitFor(() => expect(screen.getByText('Copied!')).toBeInTheDocument());
  });

  it('resets copy button text back to Copy Link after timeout', async () => {
    jest.useFakeTimers();
    render(<ShareBar {...defaultProps} />);
    const copyButton = screen.getByRole('button', { name: /copy link/i });
    fireEvent.click(copyButton);
    await waitFor(() => expect(screen.getByText('Copied!')).toBeInTheDocument());
    await React.act(async () => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText('Copy Link')).toBeInTheDocument();
    jest.useRealTimers();
  });
});
