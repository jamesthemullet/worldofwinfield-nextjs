import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import Intro from './intro';
import { JamesImagesProps } from '../lib/types';

jest.mock('../pages/_app', () => ({
  colours: {
    dark: '#291720',
    white: '#FFFFFF',
    pink: '#D90368',
    purple: '#8884FF',
    burgandy: '#820263',
    green: '#04A777',
    blueish: '#547AA5',
    azure: '#3185FC',
  },
}));

const mockJamesImages: JamesImagesProps = {
  edges: Array.from({ length: 20 }, (_, i) => ({
    node: {
      title: `James Photo ${i + 1}`,
      featuredImage: {
        node: {
          mediaDetails: { height: 300, width: 300, sizes: '' },
          sourceUrl: `/images/photo-${i + 1}.jpg`,
          srcset: '',
        },
      },
    },
  })),
};

describe('Intro', () => {
  it('renders a section element', () => {
    const { container } = render(<Intro jamesImages={mockJamesImages} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders a visually hidden heading with the site name', () => {
    render(<Intro jamesImages={mockJamesImages} />);
    expect(screen.getByText('World Of Winfield')).toBeInTheDocument();
  });

  it('renders 16 blocks, one per character in "WORLD OFWINFIELD"', () => {
    const { container } = render(<Intro jamesImages={mockJamesImages} />);
    // section > div (GridContainer) > div (Block) x 16
    const blocks = container.querySelectorAll('section > div > div');
    expect(blocks).toHaveLength(16);
  });
});
