import { AppProps } from 'next/app';
import Nav from '../components/nav';
import { Global, css } from '@emotion/react';

export const colours = {
  orange: '#FB8B24',
  pink: '#D90368',
  purple: '#820263',
  dark: '#291720',
  green: '#04A777',
  white: '#FFFFFF',
};

export const globalStyles = css`
  @import url('/fonts.css');

  :root {
    /* Define your colors as CSS custom properties */
    --colour-orange: ${colours.orange};
    --colour-pink: ${colours.pink};
    --colour-purple: ${colours.purple};
    --colour-dark: ${colours.dark};
    --colour-green: ${colours.green};
    --colour-white: ${colours.white};
  }

  /* Additional global styles can be included here */
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Global styles={globalStyles} />
      <Nav />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
