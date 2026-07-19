import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import ImageLightbox from './image-lightbox';

describe('ImageLightbox', () => {
  it('renders the image with the given src and alt', () => {
    render(<ImageLightbox src="/photo.jpg" alt="A photo" onClose={jest.fn()} />);
    const image = screen.getByAltText('A photo');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/photo.jpg');
  });

  it('uses the alt text as the dialog label, falling back when empty', () => {
    render(<ImageLightbox src="/photo.jpg" alt="" onClose={jest.fn()} />);
    expect(screen.getByRole('dialog', { name: 'Zoomed image' })).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = jest.fn();
    render(<ImageLightbox src="/photo.jpg" alt="A photo" onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = jest.fn();
    render(<ImageLightbox src="/photo.jpg" alt="A photo" onClose={onClose} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when the image itself is clicked', () => {
    const onClose = jest.fn();
    render(<ImageLightbox src="/photo.jpg" alt="A photo" onClose={onClose} />);
    fireEvent.click(screen.getByAltText('A photo'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when the Escape key is pressed', () => {
    const onClose = jest.fn();
    render(<ImageLightbox src="/photo.jpg" alt="A photo" onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('focuses the close button on mount', () => {
    render(<ImageLightbox src="/photo.jpg" alt="A photo" onClose={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });
});
