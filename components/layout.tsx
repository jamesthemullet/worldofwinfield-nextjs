import Alert from './alert';
import Footer from './footer';
import Meta from './meta';
import { LayoutProps } from '../lib/types';
import styled from '@emotion/styled';

export default function Layout({ preview, children, seo, title, ogType, articleDate, articleModified, articleAuthor }: LayoutProps) {
  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <Meta seo={seo ?? undefined} title={title} ogType={ogType} articleDate={articleDate} articleModified={articleModified} articleAuthor={articleAuthor} />
      <StyledDiv>
        <Alert preview={preview} />
        <main id="main-content">{children}</main>
      </StyledDiv>
      <Footer />
    </>
  );
}

const StyledDiv = styled.div`
  flex: 1;
`;

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
