import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { StyledButton, StyledInput, StyledSelect } from './core-components';

describe('core-components', () => {
  it('StyledButton renders a button element', () => {
    render(<StyledButton>Click me</StyledButton>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('StyledSelect renders a select element', () => {
    render(<StyledSelect aria-label="test select" />);
    expect(screen.getByRole('combobox', { name: 'test select' })).toBeInTheDocument();
  });
});
