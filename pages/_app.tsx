import { AppProps } from 'next/app';
import Nav from '../components/nav';
import { Global, css } from '@emotion/react';
import Head from 'next/head';
import styled from '@emotion/styled';

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
  @font-face {
    font-family: 'Oswald';
    src: url('/fonts/Oswald-VariableFont_rght.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  :root {
    /* Define your colors as CSS custom properties */
    --colour-purple: ${colours.purple};
    --colour-pink: ${colours.pink};
    --colour-burgandy: ${colours.burgandy};
    --colour-dark: ${colours.dark};
    --colour-green: ${colours.green};
    --colour-white: ${colours.white};
    --colour-blueish: ${colours.blueish};
    --colour-azure: ${colours.azure};
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
