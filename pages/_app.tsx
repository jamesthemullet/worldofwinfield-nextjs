import { AppProps } from 'next/app';
import Nav from '../components/nav';
import { Global } from '@emotion/react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Global
        styles={`
        @import url('/fonts.css');
        /* Additional global styles can be included here */
      `}
      />
      <Nav />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
