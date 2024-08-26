import Alert from './alert';
import Footer from './footer';
import Meta from './meta';
import { LayoutProps } from '../lib/types';
import styled from '@emotion/styled';

export default function Layout({ preview, children, seo }: LayoutProps) {
  return (
    <>
      <Meta seo={seo} />
      <StyledDiv>
        <Alert preview={preview} />
        {children}
      </StyledDiv>
      <Footer />
    </>
  );
}

const StyledDiv = styled.div`
  flex: 1;
`;
