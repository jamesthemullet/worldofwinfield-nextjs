import Avatar from './avatar';
import Date from './date';
import CoverImage from './cover-image';
import Link from 'next/link';
import { PostPreviewProps } from '../lib/types';
import styled from '@emotion/styled';

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: PostPreviewProps) {
  return (
    <div>
      <ImageContainer>
        {coverImage && <CoverImage title={title} coverImage={coverImage} slug={slug} />}
      </ImageContainer>
      <h2>
        <Link href={`/posts/${slug}`} dangerouslySetInnerHTML={{ __html: title }}></Link>
      </h2>
      <div>
        <Date dateString={date} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: excerpt }} />
      <Avatar author={author} />
    </div>
  );
}

const ImageContainer = styled.div`
  position: relative;
  min-width: 100vw;
  min-height: 50vw;
`;
