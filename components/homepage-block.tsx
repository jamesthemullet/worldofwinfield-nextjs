import styled from '@emotion/styled';
import { colours } from '../pages/_app';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from './search-results';
import { JamesImagesProps } from '../lib/types';
import { useEffect, useState } from 'react';

type HomePageBlockTypes = {
  className: string;
  title: string;
  url: string;
  size: number;
  image?: {
    node: {
      mediaDetails: {
        height: number;
        width: number;
        sizes: string;
      };
      srcset: string;
      sourceUrl: string;
    };
  };
  date?: string;
  jamesImages: JamesImagesProps;
};

const blockColours = [
  colours.pink,
  colours.green,
  colours.purple,
  colours.burgandy,
  colours.dark,
  colours.azure,
  colours.blueish,
];

export default function HomepageBlock({
  className,
  url,
  title,
  size,
  image,
  date,
  jamesImages,
}: HomePageBlockTypes) {
  const randomIndex = Math.floor(Math.random() * blockColours.length);
  const randomColour = blockColours[randomIndex];
  let width, height;

  if (title === 'placeholder') {
    const randomJamesImage = Math.floor(Math.random() * jamesImages.edges.length);
    image = jamesImages.edges[randomJamesImage].node.featuredImage;
    width = 280 * size;
    height = 280 * size;
  } else if (size === 1) {
    width = 300;
    height = 300;
  } else if (size === 2) {
    width = 600;
    height = 450;
  } else {
    width = 920;
    height = 720;
  }

  const eagerOrLazy = () => {
    if (className.includes('block-1') || className.includes('block-2')) {
      return 'eager';
    } else {
      return 'lazy';
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check on component mount
    checkIfMobile();

    // Listen for window resize to update isMobile
    window.addEventListener('resize', checkIfMobile);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return url ? (
    <Block
      backgroundColour={randomColour}
      colour={colours.white}
      size={size}
      className={className}
      image={image}
      date={date}>
      <StyledLink href={url}>
        {image?.node && (
          <ImageContainer>
            {!isMobile && (
              <Image
                src={image.node.sourceUrl}
                alt={title}
                width={width}
                height={height}
                sizes={image.node.srcset}
                quality={0}
                loading={eagerOrLazy()}
              />
            )}
          </ImageContainer>
        )}
        {date && title !== 'placeholder' ? (
          <div>
            <p>{title}</p>
            {date && <p className="date">{formatDate(date)}</p>}
          </div>
        ) : (
          <p>{title}</p>
        )}
      </StyledLink>
    </Block>
  ) : (
    <Block
      backgroundColour={randomColour}
      colour={colours.white}
      size={size}
      image={image}
      date={date}>
      <p>test</p>
    </Block>
  );
}

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  width: 100%;
  height: 100%;
  text-align: center;
  position: relative;

  div {
    position: absolute;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  max-height: 500px;

  img {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0%);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Block = styled.div<{
  backgroundColour: string;
  colour: string;
  size: number;
  image: {
    node: {
      mediaDetails: { height: number; width: number; sizes: string };
      srcset: string;
      sourceUrl: string;
    };
  };
  date: string;
}>`
  background-color: ${(props) => props.backgroundColour};
  color: ${(props) => props.colour};
  display: flex;
  min-height: 100px;
  border: 1px solid #ccc;
  margin: 2px;
  padding: ${(props) => !props.image && !props.date && '10px'};
  grid-column: span ${(props) => props.size};
  grid-row: span ${(props) => props.size};
  overflow: hidden;

  img {
    object-fit: none;
  }

  @media (max-width: 768px) {
    width: calc(100%);
    aspect-ratio: 2/1;
    height: 50px;

    &.placeholder {
      display: none;
    }
  }

  p {
    font-size: 1.5rem;
    transition: font-size 0.3s ease;
    font-weight: 700;

    &.date {
      font-size: 1rem;
      font-weight: 400;
    }
  }

  &::before {
    content: '';
    display: block;
    padding-top: 100%;
    pointer-events: none;
  }

  @media (min-width: 769px) {
    &.block-1-1,
    &.block-1-2,
    &.block-1-3,
    &.block-5-1,
    &.block-5-9,
    &.block-6-1,
    &.block-6-2,
    &.block-6-3,
    &.block-7-3,
    &.block-7-9,
    &.block-8-1,
    &.block-8-2,
    &.block-8-3,
    &.block-8-4,
    &.block-9-1,
    &.block-9-2,
    &.block-10-3,
    &.block-11-1,
    &.block-11-2,
    &.block-12-3,
    &.block-13-9,
    &.block-14-2,
    &.block-14-3,
    &.block-14-4,
    &.block-14-5,
    &.block-14-9 {
      display: none;
    }
  }

  @media (min-width: 850px) {
    &.block-2-1,
    &.block-2-2,
    &.block-2-3,
    &.block-5-1,
    &.block-5-2,
    &.block-7-1,
    &.block-7-2,
    &.block-10-1,
    &.block-10-2,
    &.block-11-1,
    &.block-12-1,
    &.block-13-1,
    &.block-13-2,
    &.block-13-3,
    &.block-14-1 {
      display: none;
    }
    &.block-1-1,
    &.block-1-2,
    &.block-1-3,
    &.block-6-1,
    &.block-6-2,
    &.block-6-3,
    &.block-7-9,
    &.block-8-1,
    &.block-8-2,
    &.block-8-3,
    &.block-8-4,
    &.block-9-1,
    &.block-9-2,
    &.block-10-3,
    &.block-11-1,
    &.block-11-2,
    &.block-11-3,
    &.block-14-9 {
      display: flex;
    }
  }

  @media (min-width: 1060px) {
    &.block-1-1,
    &.block-1-2,
    &.block-1-3,
    &.block-5-1,
    &.block-6-1,
    &.block-6-2,
    &.block-6-3,
    &.block-8-3,
    &.block-8-4,
    &.block-9-1,
    &.block-9-2,
    &.block-10-3,
    &.block-11-1,
    &.block-11-2,
    &.block-11-3,
    &.block-12-3,
    &.block-14-9 {
      display: none;
    }

    &.block-10-1,
    &.block-10-2,
    &.block-13-1,
    &.block-14-1,
    &.block-14-2,
    &.block-14-3 {
      display: flex;
    }
  }

  @media (min-width: 1270px) {
    &.block-7-9,
    &.block-8-1,
    &.block-8-2,
    &.block-10-1,
    &.block-10-2,
    &.block-13-1,
    &.block-14-1,
    &.block-14-2,
    &.block-14-3 {
      display: none;
    }
    &.block-2-1,
    &.block-2-2,
    &.block-2-3,
    &.block-6-1,
    &.block-7-1,
    &.block-7-2,
    &.block-11-1,
    &.block-11-2,
    &.block-12-1,
    &.block-14-1,
    &.block-14-2 {
      display: flex;
    }
  }

  @media (min-width: 1480px) {
    &.block-2-1,
    &.block-2-2,
    &.block-2-3,
    &.block-11-1,
    &.block-11-2,
    &.block-12-1 {
      display: none;
    }
    &.block-6-2,
    &.block-7-3,
    &.block-8-1,
    &.block-9-1,
    &.block-9-2,
    &.block-14-3 {
      display: flex;
    }
  }

  @media (min-width: 1690px) {
    &.block-6-1,
    &.block-6-2,
    &.block-7-1,
    &.block-7-2,
    &.block-7-3,
    &.block-9-1,
    &.block-9-2 {
      display: none;
    }
    &.block-5-1,
    &.block-5-2,
    &.block-8-2,
    &.block-13-1,
    &.block-13-2,
    &.block-13-9,
    &.block-14-4,
    &.block-14-5 {
      display: flex;
    }
  }

  @media (min-width: 1900px) {
    &.block-5-1,
    &.block-5-2,
    &.block-8-1,
    &.block-8-2,
    &.block-13-1,
    &.block-13-2,
    &.block-13-9,
    &.block-14-1,
    &.block-14-2,
    &.block-14-3,
    &.block-14-4,
    &.block-14-5 {
      display: none;
    }

    &.block-5-9,
    &.block-6-1,
    &.block-8-1,
    &.block-9-1,
    &.block-11-1 {
      display: flex;
    }
  }
`;
