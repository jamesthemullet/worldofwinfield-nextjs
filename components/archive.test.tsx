import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ArchiveDropdown from './archive';

const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

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

describe('ArchiveDropdown', () => {
  beforeEach(() => {
    mockPush.mockReset();
  });

  it('renders the "Posts from the archives" label', () => {
    render(<ArchiveDropdown />);
    expect(screen.getByText('Posts from the archives')).toBeInTheDocument();
  });

  it('renders a select element with the correct aria-label', () => {
    render(<ArchiveDropdown />);
    expect(screen.getByLabelText('Select month')).toBeInTheDocument();
  });

  it('renders a default "Select Month" placeholder option', () => {
    render(<ArchiveDropdown />);
    const select = screen.getByLabelText('Select month') as HTMLSelectElement;
    const options = Array.from(select.options).map((o) => o.text);
    expect(options).toContain('Select Month');
  });

  it('includes January 2010 as the first month option', () => {
    render(<ArchiveDropdown />);
    const select = screen.getByLabelText('Select month') as HTMLSelectElement;
    const options = Array.from(select.options).map((o) => o.text);
    expect(options).toContain('January 2010');
  });

  it('navigates to /archive-page with correct month and year when a month is selected', () => {
    render(<ArchiveDropdown />);
    const select = screen.getByLabelText('Select month');
    fireEvent.change(select, { target: { value: 'March 2015' } });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/archive-page',
      query: { month: 3, year: '2015' },
    });
  });

  it('navigates with month number 1 for January', () => {
    render(<ArchiveDropdown />);
    const select = screen.getByLabelText('Select month');
    fireEvent.change(select, { target: { value: 'January 2010' } });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/archive-page',
      query: { month: 1, year: '2010' },
    });
  });

  it('does not navigate when the placeholder empty option is selected', () => {
    render(<ArchiveDropdown />);
    const select = screen.getByLabelText('Select month');
    fireEvent.change(select, { target: { value: '' } });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
