import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from './layout';

jest.mock('./alert', () => ({
  __esModule: true,
  default: ({ preview }: { preview: string | null }) =>
    preview ? <div data-testid="alert">Preview Mode</div> : null,
}));

jest.mock('./meta', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('./footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Footer</footer>,
}));

describe('Layout', () => {
  it('renders children inside the main element', () => {
    render(
      <Layout preview={null}>
        <p>Page content</p>
      </Layout>
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('renders the skip-to-main-content link', () => {
    render(
      <Layout preview={null}>
        <p>Content</p>
      </Layout>
    );
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('gives the main element the id "main-content" for the skip link to target', () => {
    render(
      <Layout preview={null}>
        <p>Content</p>
      </Layout>
    );
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });

  it('renders the footer', () => {
    render(
      <Layout preview={null}>
        <p>Content</p>
      </Layout>
    );
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders the alert banner when in preview mode', () => {
    render(
      <Layout preview="true">
        <p>Content</p>
      </Layout>
    );
    expect(screen.getByTestId('alert')).toBeInTheDocument();
  });

  it('does not render the alert banner outside preview mode', () => {
    render(
      <Layout preview={null}>
        <p>Content</p>
      </Layout>
    );
    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
  });
});
