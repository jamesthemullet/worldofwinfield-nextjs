import { render, screen } from '@testing-library/react';
import React from 'react';
import MyApp from './_app';

type AppProps = {
  Component: React.ComponentType;
  pageProps: Record<string, any>;
  router: any;
};

const pageContent = 'test content';

describe('App tests', () => {
  it('should contains the heading 1', () => {
    const props: AppProps = {
      Component: () => <div>{pageContent}</div>,
      pageProps: {},
      router: {},
    };

    render(<MyApp {...props} />);
    expect(screen.queryByText('test content')).toBeInTheDocument();
  });
});
