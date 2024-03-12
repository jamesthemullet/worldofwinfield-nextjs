import Avatar from './avatar';
import Date from './date';
import CoverImage from './cover-image';
import Link from 'next/link';
import { PostPreviewProps } from '../lib/types';
import styled from '@emotion/styled';
import PostHeader from './post-header';
import { StyledButton } from './core-components';

export default function PostPreview({
  title,
  date,
  excerpt,
  author,
  slug,
  featuredImage,
}: PostPreviewProps) {
  const replaceSlugInExcerpt = (excerpt) => {
    const regex = /<a\s+(?:[^>]*?\s+)?href="https?:\/\/[^"]*"[^>]*>.*?<\/a>/g;
    const excerptWithoutSlug = excerpt.replace(regex, '');
    return excerptWithoutSlug;
  };

  return (
    <div>
      <div>
        <PostHeader
          title={title}
          coverImage={featuredImage}
          date={date}
          author={author}
          slug={slug}
        />
      </div>
      <StyledExcerptContainer>
        <StyledExcerpt dangerouslySetInnerHTML={{ __html: replaceSlugInExcerpt(excerpt) }} />
        <StyledButton>
          <Link href={slug}>Read More</Link>
        </StyledButton>
      </StyledExcerptContainer>
    </div>
  );
}

const StyledExcerpt = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0 1rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  box-sizing: border-box;
  max-width: 60rem;

  @media (min-width: 1281px) {
    margin: 4rem auto 0;
  }

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
