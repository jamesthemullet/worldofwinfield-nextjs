import Avatar from './avatar';
import Date from './date';
import CoverImage from './cover-image';
import Link from 'next/link';
import { HeroPostProps } from '../lib/types';
import styled from '@emotion/styled';

export default function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: HeroPostProps) {
  return (
    <StyledSection>
      <ImageContainer>
        {coverImage && <CoverImage title={title} coverImage={coverImage} slug={slug} />}
      </ImageContainer>
      <div>
        <div>
          <h2>
            <Link href={`/posts/${slug}`} dangerouslySetInnerHTML={{ __html: title }}></Link>
          </h2>
          <div>
            <Date dateString={date} />
          </div>
        </div>
        <div>
          <div dangerouslySetInnerHTML={{ __html: excerpt }} />
          <Avatar author={author} />
        </div>
      </div>
    </StyledSection>
  );
}

const StyledSection = styled.section`
  position: relative;
`;

const ImageContainer = styled.div`
  position: relative;
  min-width: 10vw;
  min-height: 50vw;
`;
