import { HeroPostProps } from '../lib/types';
import styled from '@emotion/styled';
import PostHeader from './post-header';

export default function HeroPost({
  title,
  date,
  excerpt,
  author,
  slug,
  featuredImage,
}: HeroPostProps) {
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
          />
        </div>
        <div>
          <StyledExcerpt dangerouslySetInnerHTML={{ __html: excerpt }} />
        </div>
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
