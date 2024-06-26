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
  icon?: string;
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
  icon,
}: HomePageBlockTypes) {
  const [randomColour, setRandomColour] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * blockColours.length);
    const randomColour = blockColours[randomIndex];
    setRandomColour(randomColour);

    if (title === 'placeholder') {
      const randomJamesImage = Math.floor(Math.random() * jamesImages.edges.length);
      setImageSrc(jamesImages.edges[randomJamesImage].node.featuredImage);
    } else {
      setImageSrc(image);
    }

    if (title === 'random photo') {
      setImageSrc(image);
    }
  }, [title, size, image]);

  const eagerOrLazy = () => {
    if (className.includes('block-1-') || className.includes('block-2-')) {
      return 'eager';
    } else {
      return 'lazy';
    }
  };

  return !icon ? (
    <Block
      backgroundColour={randomColour}
      colour={colours.white}
      size={size}
      className={className}
      image={imageSrc}
      date={date}>
      {url && title !== 'random photo' ? (
        <StyledLinkImage href={url} aria-label={title}>
          {imageSrc?.node && size === 1 && (
            <Image
              src={imageSrc.node.sourceUrl}
              alt={title}
              width={230}
              height={230}
              quality={80}
              loading={eagerOrLazy()}
            />
          )}

          {imageSrc?.node && size === 2 && (
            <Image
              src={imageSrc.node.sourceUrl}
              alt={title}
              width={474}
              height={474}
              quality={80}
              loading={eagerOrLazy()}
            />
          )}

          {imageSrc?.node && size === 3 && (
            <Image
              src={imageSrc.node.sourceUrl}
              alt={title}
              width={840}
              height={840}
              quality={80}
              loading={eagerOrLazy()}
            />
          )}
        </StyledLinkImage>
      ) : (
        imageSrc?.node &&
        (size === 1 || size === 2) && (
          <Image
            src={imageSrc.node.sourceUrl}
            alt={title}
            width={size === 1 ? 270 : 550}
            height={size === 1 ? 270 : 550}
            quality={80}
            loading={eagerOrLazy()}
          />
        )
      )}

      {url && date && (
        <StyledLink href={url}>
          {title !== 'placeholder' && title !== 'random photo' && <p aria-label={title}>{title}</p>}
          {date && title !== 'placeholder' && <p className="date">{formatDate(date)}</p>}
        </StyledLink>
      )}
    </Block>
  ) : (
    <Block
      backgroundColour={randomColour}
      colour={colours.white}
      size={size}
      image={imageSrc}
      date={date}>
      <StyledIconLinkBlock href={url}>
        <p aria-label={title}>{title}</p>
        <StyledIcon>
          <img src={`/icons/${icon}.png`} alt="icon" />
        </StyledIcon>
      </StyledIconLinkBlock>
    </Block>
  );
}

const StyledLinkImage = styled(Link)`
  text-decoration: none;
  color: inherit;
  text-align: center;
  position: relative;
  height: 0;
`;

const StyledLink = styled(Link)`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0;
  width: 100%;
  text-align: center;
  text-decoration: none;
  color: inherit;
`;

const StyledIconLinkBlock = styled(Link)`
  text-decoration: none;
  color: inherit;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledIcon = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
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
  position: relative;
  justify-content: center;
  aspect-ratio: 1;

  img {
    object-fit: cover;
  }

  @media (max-width: 768px) {
    border: 0;
    margin: 0;
    width: 100%;

    &.placeholder {
      display: none;
    }
  }

  p {
    font-size: 1.5rem;
    transition: font-size 0.3s ease;
    font-weight: 700;
    padding: 0 10px;

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

  @media (max-width: 768px) {
    &.block-1-1,
    &.block-1-2,
    &.block-5-1,
    &.block-5-2,
    &.block-8-1,
    &.block-8-2 {
      display: flex;
      width: 50%;
      aspect-ratio: 1/1;
    }
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
