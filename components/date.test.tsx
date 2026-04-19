import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Date from './date';

describe('Date component', () => {
  it('renders a <time> element', () => {
    const { container } = render(<Date dateString="2023-01-15" />);
    expect(container.querySelector('time')).toBeInTheDocument();
  });

  it('sets the dateTime attribute to the raw ISO string', () => {
    render(<Date dateString="2023-01-15" />);
    const timeEl = screen.getByText(/January/);
    expect(timeEl).toHaveAttribute('dateTime', '2023-01-15');
  });

  it('formats the date as "Month D, YYYY"', () => {
    render(<Date dateString="2023-06-21" />);
    expect(screen.getByText('June 21, 2023')).toBeInTheDocument();
  });

  it('correctly formats a date at the start of the year', () => {
    render(<Date dateString="2020-01-01" />);
    expect(screen.getByText('January 1, 2020')).toBeInTheDocument();
  });

  it('correctly formats a date at the end of the year', () => {
    render(<Date dateString="2022-12-31" />);
    expect(screen.getByText('December 31, 2022')).toBeInTheDocument();
  });
});
