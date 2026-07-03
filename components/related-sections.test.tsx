import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import RelatedSections from './related-sections';

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

const mockSections = [
  { label: 'Music', href: '/music', colour: '#D90368' },
  { label: 'Travel', href: '/travel', colour: '#04A777' },
  { label: 'Favourites', href: '/favourites', colour: '#8884FF' },
];

describe('RelatedSections', () => {
  it('renders the "Explore more" heading', () => {
    render(<RelatedSections sections={mockSections} />);
    expect(screen.getByRole('heading', { name: 'Explore more' })).toBeInTheDocument();
  });

  it('renders a link for each section with the correct label', () => {
    render(<RelatedSections sections={mockSections} />);
    expect(screen.getByRole('link', { name: 'Music' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Travel' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Favourites' })).toBeInTheDocument();
  });

  it('renders links with the correct hrefs', () => {
    render(<RelatedSections sections={mockSections} />);
    expect(screen.getByRole('link', { name: 'Music' })).toHaveAttribute('href', '/music');
    expect(screen.getByRole('link', { name: 'Travel' })).toHaveAttribute('href', '/travel');
    expect(screen.getByRole('link', { name: 'Favourites' })).toHaveAttribute('href', '/favourites');
  });

  it('renders the heading but no links when sections is empty', () => {
    render(<RelatedSections sections={[]} />);
    expect(screen.getByRole('heading', { name: 'Explore more' })).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
