import { PostBodyProps } from '../lib/types';
import styled from '@emotion/styled';
import { colours } from '../pages/_app';
import { useEffect } from 'react';
import type { ILazyLoadInstance } from 'vanilla-lazyload';

export default function PostBody({ content }: PostBodyProps) {
  useEffect(() => {
    let lazyLoadInstance: ILazyLoadInstance | null = null;

    (async () => {
      const LazyLoadModule = await import('vanilla-lazyload');
      const LazyLoad = LazyLoadModule.default || LazyLoadModule;
      if (typeof LazyLoad === 'function') {
        lazyLoadInstance = new LazyLoad({
          elements_selector: '.lazyload',
        });
      }
    })();

    return () => {
      if (lazyLoadInstance) {
        lazyLoadInstance.destroy();
      }
    };
  }, []);
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
    height: auto;
  }

  @media (min-width: 1281px) {
    margin: 4rem auto 0;
  }

  .wp-block-image,
  .wp-block-embed,
  .wp-block-video {
    margin: 0 auto;
    max-width: 100%;
    height: auto;
    padding: 0;
    display: flex;
    flex-direction: column;

    img,
    iframe,
    video {
      width: 100%;
      height: auto;
    }

    figcaption {
      background-color: ${colours.dark};
      color: ${colours.white};
      padding: 0 0.5rem;
      font-size: 0.875rem;
      text-align: center;
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

  .wp-block-gallery {
    margin: 2rem auto;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media screen and (min-width: 768px) {
    .wp-block-gallery.has-nested-images {
      margin: 0;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .wp-block-image {
        margin: 0 auto;
        width: calc(50% - 5px);
        height: auto;
        padding: 0;
      }
    }

    figure.wp-block-gallery.has-nested-images {
      align-items: normal;
    }

    .wp-block-gallery.has-nested-images figure.wp-block-image:not(#individual-image) {
      margin: 0;
      width: calc(50% - var(--wp--style--unstable-gallery-gap, 16px) / 2);
    }

    .wp-block-gallery.has-nested-images.is-cropped figure.wp-block-image:not(#individual-image) {
      align-self: inherit;
    }

    .wp-block-gallery.has-nested-images figure.wp-block-image {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: center;
      max-width: 100%;
      position: relative;
    }

    .wp-block-gallery.has-nested-images.is-cropped figure.wp-block-image:not(#individual-image) a,
    .wp-block-gallery.has-nested-images.is-cropped
      figure.wp-block-image:not(#individual-image)
      img {
      flex: 1 0 0%;
      height: 100%;
      object-fit: cover;
      min-width: 100%;
    }
  }
`;
