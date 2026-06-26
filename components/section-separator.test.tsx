import { render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import SectionSeparator from './section-separator';

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

describe('SectionSeparator', () => {
  it('renders without crashing', () => {
    const { container } = render(<SectionSeparator />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders an hr element', () => {
    const { container } = render(<SectionSeparator />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });
});
