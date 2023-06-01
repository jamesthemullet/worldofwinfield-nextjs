import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";

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
  const image = (
    <Image
      alt={`Cover Image for ${title}`}
      src={coverImage?.node.sourceUrl}
      fill={true}
      sizes='(max-width: 400px) 100vw, 400px'
    />
  );
  return (
    <div>
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          <StyledSpan>{image}</StyledSpan>
        </Link>
      ) : (
        image
      )}
    </div>
  );
}

const StyledSpan = styled.span`
  border-radius: 5px;
  position: relative;
  display: block;
`;
