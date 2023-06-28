import Image from 'next/image';
import Link from 'next/link';
import styled from '@emotion/styled';

interface Props {
  title: string;
  coverImage: {
    node: {
      sourceUrl: string;
    };
  };
  slug?: string;
}

export default function CoverImage({ title, coverImage, slug }: Props) {
  console.log(1, coverImage);
  const image = (
    <Image
      alt={`Cover Image for ${title}`}
      src={coverImage?.node.sourceUrl}
      sizes={coverImage?.node.mediaDetails.srcset}
      fill
    />
  );
  return (
    <>
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </>
  );
}
