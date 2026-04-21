import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Container from './container';

describe('Container', () => {
  it('renders its children', () => {
    render(
      <Container>
        <p>Child content</p>
      </Container>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <Container>
        <p>First child</p>
        <p>Second child</p>
      </Container>
    );
    expect(screen.getByText('First child')).toBeInTheDocument();
    expect(screen.getByText('Second child')).toBeInTheDocument();
  });
});
