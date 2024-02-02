import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  title: string;
  coverImage: {
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
}

export default function CoverImage({ title, coverImage, imageSize, slug, heroPost }: Props) {
  const image = coverImage?.node.sourceUrl && (
    <Image
      alt={`Cover Image for ${title}`}
      src={coverImage?.node.sourceUrl}
      sizes={imageSize || coverImage?.node.mediaDetails.srcset}
      quality={50}
      fill
      loading={heroPost ? 'eager' : 'lazy'}
    />
  );
  return (
    <>
      {slug ? (
        <Link href={`/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        <StyledCoverImage>{image}</StyledCoverImage>
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
