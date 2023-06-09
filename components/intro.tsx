import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';
import { colours } from '../pages/_app';
import { IntroProps } from '../lib/types';

type FlipperProps = {
  flipped: boolean;
  children: React.ReactNode;
};

const blockColours = [colours.orange, colours.pink, colours.green];

export default function Intro({ jamesImages }: IntroProps) {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle the jamesImages array randomly
    const shuffledArray = [...jamesImages.edges].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffledArray);

    // Load the image URLs
    const urls = shuffledArray.map((image) => {
      const jamesImage = image?.node.featuredImage?.node;
      return jamesImage?.mediaDetails.sizes[0].sourceUrl || '';
    });
    setImageUrls(urls);
  }, [jamesImages]);

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
                    <Back src={imageUrl} alt={jamesAltTag} />
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
  font-size: 7rem;
  font-family: 'Luckiest Guy', monospace;
  padding: 0;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Back = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  object-fit: cover;
  transform: rotateY(180deg);
`;

const getColour = (index) => {
  const colourIndex = index % Object.keys(blockColours).length;
  return Object.keys(blockColours)[colourIndex];
};
