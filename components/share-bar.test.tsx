import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  it('renders the Twitter/X share link with correct href', () => {
    render(<ShareBar {...defaultProps} />);
    const twitterLink = screen.getByRole('link', { name: /share on x/i });
    expect(twitterLink).toHaveAttribute(
      'href',
      `https://x.com/intent/tweet?text=${encodeURIComponent(defaultProps.title)}&url=${encodeURIComponent(defaultProps.url)}`
    );
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the LinkedIn share link with correct href', () => {
    render(<ShareBar {...defaultProps} />);
    const linkedInLink = screen.getByRole('link', { name: /share on linkedin/i });
    expect(linkedInLink).toHaveAttribute(
      'href',
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(defaultProps.url)}`
    );
    expect(linkedInLink).toHaveAttribute('target', '_blank');
    expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');
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
