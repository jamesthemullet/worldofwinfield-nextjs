import { useMemo } from 'react';
import { HeroPostProps } from '../lib/types';
import styled from '@emotion/styled';
import PostHeader from './post-header';
import { StyledButton } from './core-components';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';

const stripExternalLinks = (excerpt: string) => {
  const regex = /<a\s+(?:[^>]*?\s+)?href="https?:\/\/[^"]*"[^>]*>.*?<\/a>/g;
  return excerpt.replace(regex, '');
};

export default function HeroPost({
  title,
  date,
  excerpt,
  author,
  slug,
  featuredImage,
}: HeroPostProps) {
  const sanitizedExcerpt = useMemo(
    () => DOMPurify.sanitize(stripExternalLinks(excerpt)),
    [excerpt]
  );

  return (
    <StyledSection>
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
          <StyledButton>
            <Link href={slug}>Read More</Link>
          </StyledButton>
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
