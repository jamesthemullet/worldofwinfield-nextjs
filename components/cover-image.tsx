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
}

export default function CoverImage({ title, coverImage, imageSize, slug }: Props) {
  const image = coverImage?.node.sourceUrl && (
    <Image
      alt={`Cover Image for ${title}`}
      src={coverImage?.node.sourceUrl}
      sizes={imageSize || coverImage?.node.mediaDetails.srcset}
      fill
    />
  );
  return (
    <>
      {slug ? (
        <Link href={`/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </>
  );
}
