import { PostBodyProps } from '../lib/types';
import styled from '@emotion/styled';

export default function PostBody({ content }: PostBodyProps) {
  return (
    <ContentContainer>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </ContentContainer>
  );
}

export const ContentContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0 1rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  box-sizing: border-box;
  max-width: 60rem;

  a {
    margin: 0 !important;
  }

  img {
    max-width: calc(100% - 20px);
    height: auto;
  }

  @media (min-width: 1281px) {
    margin: 4rem auto 0;
  }

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

  .wp-block-heading {
    font-family: 'Oswald', sans-serif;
    font-size: 2rem;
    line-height: 3rem;
    letter-spacing: 2px;

    @media (min-width: 1281px) {
      font-size: 3rem;
      line-height: 4.5rem;
    }
  }

  @media screen and (min-width: 760px) {
    .wp-block-gallery.has-nested-images {
      margin: 0;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;

      .wp-block-image {
        margin: 0 auto;
        width: calc(50% - 5px);
        height: auto;
        padding: 0;
      }
    }
  }
`;
