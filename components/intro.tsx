import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';
import { colours } from '../pages/_app';
import { IntroProps } from '../lib/types';
import Image from 'next/image';

type FlipperProps = {
  flipped: boolean;
  children: React.ReactNode;
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

export default function Intro({ jamesImages }: IntroProps) {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [backImageWidth, setBackImageWidth] = useState(0);

  useEffect(() => {
    const shuffledArray = [...jamesImages.edges].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffledArray);

    const urls = shuffledArray.map((image) => {
      const jamesImage = image?.node.featuredImage?.node;
      return jamesImage?.sourceUrl || '';
    });
    setImageUrls(urls);
  }, [jamesImages]);

  useEffect(() => {
    const margin = window && window.innerWidth < 768 ? 3 : 13;
    setBackImageWidth(window && window.innerWidth / 8 - margin);
  });

  const handleBlockHover = (index) => {
    setHoveredIndex(index);
  };

  return (
    <section>
      <HiddenHeading>World Of Winfield</HiddenHeading>
      <GridContainer>
        {Array.from('WORLD OFWINFIELD').map((letter, index) => {
          const jamesImage = shuffledImages[index]?.node.featuredImage?.node;
          const jamesAltTag = shuffledImages[index]?.node.title;
          const imageUrl = imageUrls[index];

          return (
            <Block
              key={index}
              color={blockColours[getColour(index)]}
              onMouseEnter={() => handleBlockHover(index)}
              onMouseLeave={() => handleBlockHover(-1)}>
              <FlipContainer>
                <Flipper flipped={hoveredIndex === index}>
                  <Front>{letter}</Front>
                  {jamesImage && imageUrl && hoveredIndex === index && (
                    <Back>
                      <Image
                        src={imageUrl}
                        alt={jamesAltTag}
                        width={backImageWidth}
                        height={backImageWidth}
                        sizes={jamesImage.srcset}
                        quality={100}
                      />
                    </Back>
                  )}
                </Flipper>
              </FlipContainer>
            </Block>
          );
        })}
      </GridContainer>
    </section>
  );
}

const HiddenHeading = styled.h1`
  position: absolute;
  top: -9999px;
  left: -9999px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: 100%;
  box-sizing: border-box;
  aspect-ratio: 8/1;

  @media (min-width: 769px) {
    border: 5px solid ${colours.white};
  }
`;

const Block = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color};
  color: ${colours.white};
  aspect-ratio: 1/1;

  @media (min-width: 769px) {
    border: 5px solid ${colours.white};
  }
`;

const FlipContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1000px;
`;

const Flipper = styled.div(({ flipped }: FlipperProps) => ({
  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
  transition: 'transform 0.5s',
  transformStyle: 'preserve-3d',
  width: '100%',
  height: '100%',
}));

const Front = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-family: 'Oswald', monospace;
  padding: 0;
  margin: 0;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 3rem;
  }

  @media (min-width: 1200px) {
    font-size: 5rem;
  }
`;

const Back = styled.div`
  position: relative;
  cursor: pointer;
`;

const getColour = (index) => {
  const colourIndex = index % Object.keys(blockColours).length;
  return Object.keys(blockColours)[colourIndex];
};
