import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import type { AppProps } from 'next/app';
import MyApp from './_app';

const pageContent = 'test content';

jest.mock('@next/third-parties/google', () => ({
  GoogleAnalytics: jest.fn().mockReturnValue(null),
}));

describe('App tests', () => {
  it('should load the app page and  display content', () => {
    // Cast minimal mock object to AppProps — router is not used by MyApp
    const props = {
      Component: () => <div>{pageContent}</div>,
      pageProps: {},
      router: {},
    } as unknown as AppProps;

    render(<MyApp {...props} />);
    expect(screen.queryByText('test content')).toBeInTheDocument();
  });
});
