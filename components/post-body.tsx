import styles from './post-body.module.css';
import { PostBodyProps } from '../lib/types';

export default function PostBody({ content }: PostBodyProps) {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}