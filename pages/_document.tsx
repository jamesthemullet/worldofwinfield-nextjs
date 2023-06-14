import { Html, Head, Main, NextScript } from 'next/document';
import styled from '@emotion/styled';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <StyledBody>
        <Main />
        <NextScript />
      </StyledBody>
    </Html>
  );
}

const StyledBody = styled.body`
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  font-size: 1.2rem;
  line-height: 1.5;
  color: #333;
  background-color: #fff;
`;
