import styled from '@emotion/styled';
import Link from 'next/link';
import { type JSX, useMemo } from 'react';
import { sanitize, stripExternalLinks } from '../lib/sanitize';
import type { HeroPostProps } from '../lib/types';
import { colours } from '../pages/_app';
import PostHeader from './post-header';

export default function HeroPost({
  title,
  date,
  excerpt,
  author,
  slug,
  featuredImage,
}: HeroPostProps): JSX.Element {
  const sanitizedExcerpt = useMemo(() => sanitize(stripExternalLinks(excerpt)), [excerpt]);

  return (
    <StyledSection aria-label="Featured post">
      <div>
        <div>
          <PostHeader
            title={title}
            coverImage={featuredImage}
            date={date}
            author={author}
            slug={slug}
            heroPost={true}
            caption={featuredImage?.node.caption}
          />
        </div>
        <StyledExcerptContainer>
          <StyledExcerpt dangerouslySetInnerHTML={{ __html: sanitizedExcerpt }} />
          <ReadMoreLink href={slug} aria-label={`Read more about ${title}`}>
            Read More
          </ReadMoreLink>
        </StyledExcerptContainer>
      </div>
    </StyledSection>
  );
}

const StyledSection = styled.section`
  position: relative;
`;

const StyledExcerpt = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0 1rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  box-sizing: border-box;
  max-width: 60rem;

  a {
    margin-top: 20px;
    display: block;
  }

  p {
    word-wrap: break-word;
  }
`;

const ReadMoreLink = styled(Link)`
  display: inline-block;
  padding: 10px;
  font-size: 1rem;
  min-width: 100px;
  background-color: ${colours.pink};
  color: ${colours.white};
  font-weight: bold;
  text-decoration: none;
  text-align: center;

  &:hover {
    color: ${colours.dark};
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    flex: 1;
  }
`;

const StyledExcerptContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
  max-width: 60rem;
  margin: 0 auto;

  a {
    text-decoration: none;
    color: white;
  }
`;
