import styled from '@emotion/styled';
import { colours } from '../pages/_app';
import Link from 'next/link';

type HomePageBlockTypes = {
  className: string;
  title: string;
  url: string;
  size: number;
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

export default function HomepageBlock({ className, url, title, size }: HomePageBlockTypes) {
  const randomIndex = Math.floor(Math.random() * blockColours.length);
  const randomColour = blockColours[randomIndex];

  return url ? (
    <Block backgroundColour={randomColour} colour={colours.white} size={size} className={className}>
      <StyledLink href={url}>
        <p>{title}</p>
      </StyledLink>
    </Block>
  ) : (
    <Block backgroundColour={randomColour} colour={colours.white} size={size}>
      <p>test</p>
    </Block>
  );
}

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Block = styled.div<{ backgroundColour: string; colour: string; size: number }>`
  background-color: ${(props) => props.backgroundColour};
  color: ${(props) => props.colour};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  border: 1px solid #ccc;
  margin: 2px;
  grid-column: span ${(props) => props.size};
  grid-row: span ${(props) => props.size};

  @media (max-width: 768px) {
    width: calc(100%);
    aspect-ratio: 2/1;
    height: 50px;

    &.placeholder {
      display: none;
    }
  }

  p {
    font-size: 2rem;
    transition: font-size 0.3s ease;
    font-weight: 700;
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
