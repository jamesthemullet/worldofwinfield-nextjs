import type { ImageLoaderProps } from 'next/image';

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith('/')) {
    return src;
  }
  const withoutProtocol = src.replace(/^https?:\/\//, '');
  return `https://i0.wp.com/${withoutProtocol}?w=${width}&q=${quality ?? 75}&strip=all`;
}
