import Avatar from './avatar';
import Date from './date';
import CoverImage from './cover-image';
import Link from 'next/link';
import { PostPreviewProps } from '../lib/types';

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
      <div>{coverImage && <CoverImage title={title} coverImage={coverImage} slug={slug} />}</div>
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
