import styled from '@emotion/styled';
import type { JSX } from 'react';
import type { LayoutProps } from '../lib/types';
import Alert from './alert';
import Footer from './footer';
import Meta from './meta';

export default function Layout({
  preview,
  children,
  seo,
  title,
  ogType,
  articleDate,
  articleModified,
  articleAuthor,
  jsonLd,
}: LayoutProps): JSX.Element {
  return (
    <>
      <Meta
        seo={seo ?? undefined}
        title={title}
        ogType={ogType}
        articleDate={articleDate}
        articleModified={articleModified}
        articleAuthor={articleAuthor}
        jsonLd={jsonLd}
      />
      <PageWrapper>
        <StyledDiv>
          <Alert preview={preview} />
          <main id="main-content">{children}</main>
        </StyledDiv>
        <Footer />
      </PageWrapper>
    </>
  );
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 3.5rem);
`;

const StyledDiv = styled.div`
  flex: 1;
`;
