import Avatar from './avatar';
import Date from './date';
import CoverImage from './cover-image';
import PostTitle from './post-title';
import Categories from './categories';
import { PostHeaderProps } from '../lib/types';

export default function PostHeader({
  title,
  coverImage,
  date,
  author,
  categories,
}: PostHeaderProps) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div>
        <Avatar author={author} />
      </div>
      <div>
        <CoverImage title={title} coverImage={coverImage} />
      </div>
      <div>
        <div>
          <Avatar author={author} />
        </div>
        <div>
          Posted <Date dateString={date} />
          <Categories categories={categories} />
        </div>
      </div>
    </>
  );
}
