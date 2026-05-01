'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { colours } from '../pages/_app';

type ShareBarProps = {
  title: string;
  url: string;
};

export default function ShareBar({ title, url }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const threadsUrl = `https://www.threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`;
  const blueskyUrl = `https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ShareBarWrapper>
      <ShareLabel>Share this post:</ShareLabel>
      <Buttons>
        <ShareButton href={threadsUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Threads">
          Threads
        </ShareButton>
        <ShareButton href={blueskyUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Bluesky">
          Bluesky
        </ShareButton>
        <ShareButton href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
          Facebook
        </ShareButton>
        <ShareButton href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
          WhatsApp
        </ShareButton>
        <CopyButton onClick={handleCopy} aria-label="Copy link to clipboard">
          {copied ? 'Copied!' : 'Copy Link'}
        </CopyButton>
      </Buttons>
    </ShareBarWrapper>
  );
}

const ShareBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  margin: 1.5rem 0;
  text-align: center;
`;

const ShareLabel = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const buttonBase = `
  display: inline-block;
  padding: 0.4rem 0.9rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const ShareButton = styled.a`
  ${buttonBase}
  background: ${colours.burgandy};
  color: ${colours.white};
  border: none;
`;

const CopyButton = styled.button`
  ${buttonBase}
  background: ${colours.pink};
  color: ${colours.white};
  border: none;
`;
