import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SortDropdown from './SortDropdown';

const options = ['Name A-Z', 'Name Z-A', 'Date: Newest', 'Date: Oldest'];

describe('SortDropdown', () => {
  it('renders the "Sort by:" label', () => {
    render(<SortDropdown options={options} selected="" onChange={jest.fn()} />);
    expect(screen.getByText('Sort by:')).toBeInTheDocument();
  });

  it('renders the "Default" default option', () => {
    render(<SortDropdown options={options} selected="" onChange={jest.fn()} />);
    expect(screen.getByRole('option', { name: 'Default' })).toBeInTheDocument();
  });

  it('renders all provided sort options', () => {
    render(<SortDropdown options={options} selected="" onChange={jest.fn()} />);
    options.forEach((option) => {
      expect(screen.getByRole('option', { name: option })).toBeInTheDocument();
    });
  });

  it('reflects the selected option via the select value', () => {
    render(<SortDropdown options={options} selected="Name A-Z" onChange={jest.fn()} />);
    expect(screen.getByRole('combobox')).toHaveValue('Name A-Z');
  });

  it('calls onChange with the chosen value when the selection changes', () => {
    const handleChange = jest.fn();
    render(<SortDropdown options={options} selected="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Date: Newest' } });
    expect(handleChange).toHaveBeenCalledWith('Date: Newest');
  });

  it('calls onChange with an empty string when "Default" is selected', () => {
    const handleChange = jest.fn();
    render(<SortDropdown options={options} selected="Name A-Z" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('renders correctly with an empty options list', () => {
    render(<SortDropdown options={[]} selected="" onChange={jest.fn()} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Default' })).toBeInTheDocument();
  });
});
