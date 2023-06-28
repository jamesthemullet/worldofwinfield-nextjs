import { PostBodyProps } from '../lib/types';
import styled from '@emotion/styled';

export default function PostBody({ content }: PostBodyProps) {
  return (
    <ContentContainter>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </ContentContainter>
  );
}

const ContentContainter = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0 1rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  box-sizing: border-box;

  .wp-block-image,
  .wp-block-embed {
    margin: 0 auto;
    max-width: 100%;
    height: auto;
    padding: 0;

    img,
    iframe {
      width: 100%;
      height: auto;
    }
  }
`;
