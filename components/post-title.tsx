import { PostTitleProps } from '../lib/types';

export default function PostTitle({ children }: PostTitleProps) {
  return <h1 dangerouslySetInnerHTML={{ __html: children }} />;
}
