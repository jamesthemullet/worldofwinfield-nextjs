import { render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import Meta from './meta';

jest.mock('next/router', () => ({
  useRouter: () => ({ asPath: '/test-path' }),
}));

// Capture the React elements passed to Head so we can inspect them directly.
// next/head requires its own React context to inject into document.head, so DOM
// queries on document.head do not work in jsdom tests.
let capturedChildren: React.ReactNode;

jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => {
    capturedChildren = children;
    return null;
  },
}));

function findChild(type: string, matcher: (props: Record<string, string>) => boolean) {
  const children = React.Children.toArray(capturedChildren);
  return children.find(
    (child): child is React.ReactElement =>
      React.isValidElement(child) &&
      child.type === type &&
      matcher(child.props as Record<string, string>),
  );
}

describe('Meta', () => {
  it('renders the title from the seo opengraphTitle', () => {
    render(
      <Meta
        seo={{
          opengraphTitle: 'SEO Page Title',
          opengraphDescription: 'A description',
          opengraphSiteName: 'World Of Winfield',
        }}
      />,
    );
    const titleEl = React.Children.toArray(capturedChildren).find(
      (child): child is React.ReactElement => React.isValidElement(child) && child.type === 'title',
    );
    expect((titleEl?.props as { children?: string })?.children).toBe('SEO Page Title');
  });

  it('prefers the title prop over seo opengraphTitle', () => {
    render(
      <Meta
        title="Custom Title"
        seo={{
          opengraphTitle: 'SEO Page Title',
          opengraphDescription: 'A description',
          opengraphSiteName: 'World Of Winfield',
        }}
      />,
    );
    const titleEl = React.Children.toArray(capturedChildren).find(
      (child): child is React.ReactElement => React.isValidElement(child) && child.type === 'title',
    );
    expect((titleEl?.props as { children?: string })?.children).toBe('Custom Title');
  });

  it('renders a canonical link pointing to the current page URL', () => {
    render(
      <Meta
        seo={{
          opengraphTitle: 'Title',
          opengraphDescription: 'Description',
          opengraphSiteName: 'World Of Winfield',
        }}
      />,
    );
    const canonical = findChild('link', (p) => p.rel === 'canonical');
    expect((canonical?.props as { href?: string })?.href).toBe(
      'https://www.worldofwinfield.co.uk/test-path',
    );
  });
});
