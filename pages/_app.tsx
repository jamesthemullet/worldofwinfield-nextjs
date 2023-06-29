import { AppProps } from 'next/app';
import Nav from '../components/nav';
import { Global, css } from '@emotion/react';
import Head from 'next/head';

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
      <Head>
        <title>World Of Winfield</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=B612+Mono&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=IBM+Plex+Sans&family=IBM+Plex+Serif&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bungee&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Global styles={globalStyles} />
      <Nav />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
