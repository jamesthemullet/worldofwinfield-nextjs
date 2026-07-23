import createCache, { EmotionCache } from '@emotion/cache';
import { CacheProvider, css, Global } from '@emotion/react';
import styled from '@emotion/styled';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Nav from '../components/nav';

function createEmotionCache() {
  return createCache({ key: 'css' });
}

const clientSideEmotionCache = createEmotionCache();

export const colours = {
  purple: '#8884FF',
  pink: '#D90368',
  burgandy: '#820263',
  dark: '#291720',
  green: '#04A777',
  white: '#FFFFFF',
  blueish: '#547AA5',
  azure: '#3185FC',
};

export const globalStyles = css`
  #__next {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  @font-face {
    font-family: 'Oswald';
    src: url('/fonts/Oswald-VariableFont_rght.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  :root {
    --colour-purple: ${colours.purple};
    --colour-pink: ${colours.pink};
    --colour-burgandy: ${colours.burgandy};
    --colour-dark: ${colours.dark};
    --colour-green: ${colours.green};
    --colour-white: ${colours.white};
    --colour-blueish: ${colours.blueish};
    --colour-azure: ${colours.azure};
  }
`;

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  import('accented').then(({ accented }) => accented());
}

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: AppProps & { emotionCache?: EmotionCache }) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>World Of Winfield</title>
        <link
          rel="preload"
          href="/fonts/Oswald-VariableFont_rght.ttf"
          as="font"
          type="font/truetype"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://i0.wp.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </Head>
      <Global styles={globalStyles} />
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <Nav />
      <Component {...pageProps} />
      <GoogleAnalytics gaId="G-R4Y79GZQT0" />
    </CacheProvider>
  );
}

export default MyApp;

const SkipLink = styled.a`
  position: absolute;
  top: -100%;
  left: 0;
  background: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  z-index: 9999;
  font-family: sans-serif;

  &:focus {
    top: 0;
  }
`;
