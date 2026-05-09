import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import Footer from './footer';

const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('Footer', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the site name', () => {
    render(<Footer />);
    expect(screen.getByText('World Of Winfield')).toBeInTheDocument();
  });

  it('renders the Smashicons attribution link', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: 'Smashicons' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.flaticon.com/authors/smashicons');
  });

  it('renders the Flaticon attribution link', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: 'www.flaticon.com' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.flaticon.com/');
  });

  it('renders the archive dropdown', () => {
    render(<Footer />);
    expect(screen.getByRole('combobox', { name: 'Select month' })).toBeInTheDocument();
  });

  it('navigates to archive page when a month is selected', () => {
    render(<Footer />);
    const select = screen.getByRole('combobox', { name: 'Select month' });
    fireEvent.change(select, { target: { value: 'January 2024' } });
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/archive-page',
      query: { month: 1, year: '2024' },
    });
  });

  it('does not navigate when empty option is selected', () => {
    render(<Footer />);
    const select = screen.getByRole('combobox', { name: 'Select month' });
    fireEvent.change(select, { target: { value: '' } });
    expect(mockPush).not.toHaveBeenCalled();
  });
});
