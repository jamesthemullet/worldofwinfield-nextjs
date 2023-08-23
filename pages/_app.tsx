import { AppProps } from 'next/app';
import Nav from '../components/nav';
import { Global, css } from '@emotion/react';
import Head from 'next/head';
import styled from '@emotion/styled';

export const colours = {
  orange: '#FB8B24',
  pink: '#D90368',
  purple: '#820263',
  dark: '#291720',
  green: '#04A777',
  white: '#FFFFFF',
};

export const globalStyles = css`
  @font-face {
    font-family: 'Oswald';
    src: url('/fonts/Oswald-VariableFont_rght.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

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
    <StyledContainer>
      <Head>
        <title>World Of Winfield</title>
      </Head>
      <Global styles={globalStyles} />
      <Nav />
      <Component {...pageProps} />
    </StyledContainer>
  );
}

export default MyApp;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;
