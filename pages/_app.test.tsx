import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import MyApp from './_app';

type AppProps = {
  Component: React.ComponentType;
  pageProps: Record<string, unknown>;
  // Next.js's Router type has ~30 required fields; `{}` is a deliberate minimal test mock.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: any;
};

const pageContent = 'test content';

jest.mock('@next/third-parties/google', () => ({
  GoogleAnalytics: jest.fn().mockReturnValue(null),
}));

describe('App tests', () => {
  it('should load the app page and  display content', () => {
    const props: AppProps = {
      Component: () => <div>{pageContent}</div>,
      pageProps: {},
      router: {},
    };

    render(<MyApp {...props} />);
    expect(screen.queryByText('test content')).toBeInTheDocument();
  });
});
