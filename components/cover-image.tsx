import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';

type Props = {
  title: string;
  coverImage?: {
    node: {
      sourceUrl: string;
      mediaDetails: {
        width: number;
        height: number;
        sizes: string;
        srcset: string;
      };
    };
  };
  imageSize?: string;
  slug?: string;
  heroPost?: boolean;
};

export default function CoverImage({
  title,
  coverImage,
  imageSize,
  slug,
  heroPost,
}: Props): JSX.Element {
  return (
    <>
      {slug ? (
        <Link href={`/${slug}`} aria-label={title}>
          {coverImage?.node.sourceUrl && (
            <Image
              alt=""
              src={coverImage.node.sourceUrl}
              sizes={imageSize || '(max-width: 768px) 100vw, 50vw'}
              quality={75}
              fill
              priority={!!heroPost}
            />
          )}
        </Link>
      ) : (
        <StyledCoverImage>
          {coverImage?.node.sourceUrl && (
            <Image
              alt={`Cover Image for ${title}`}
              src={coverImage.node.sourceUrl}
              sizes={imageSize || '(max-width: 768px) 100vw, 50vw'}
              quality={75}
              fill
              priority={!!heroPost}
            />
          )}
        </StyledCoverImage>
      )}
    </>
  );
}

const StyledCoverImage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
