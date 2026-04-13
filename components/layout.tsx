import Alert from './alert';
import Footer from './footer';
import Meta from './meta';
import { LayoutProps } from '../lib/types';
import styled from '@emotion/styled';

export default function Layout({ preview, children, seo, title, ogType, articleDate, articleModified, articleAuthor }: LayoutProps) {
  return (
    <>
      <Meta seo={seo ?? undefined} title={title} ogType={ogType} articleDate={articleDate} articleModified={articleModified} articleAuthor={articleAuthor} />
      <StyledDiv>
        <Alert preview={preview} />
        <main>{children}</main>
      </StyledDiv>
      <Footer />
    </>
  );
}

const StyledDiv = styled.div`
  flex: 1;
`;
