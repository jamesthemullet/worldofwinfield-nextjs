import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import FavouritesHubLink from './favourites-hub-link';

describe('FavouritesHubLink', () => {
  it('renders a link back to the favourites hub', () => {
    render(<FavouritesHubLink />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/favourites');
  });

  it('displays the correct link text', () => {
    render(<FavouritesHubLink />);
    expect(screen.getByText('← Back to all favourites')).toBeInTheDocument();
  });
});
