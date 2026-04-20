import Link from 'next/link';
import Image from 'next/image';
import styled from '@emotion/styled';
import { RelatedPostsProps } from '../lib/types';
import { colours } from '../pages/_app';
import DateFormatter from './date';

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <StyledSection>
      <StyledHeading>You might also like</StyledHeading>
      <StyledGrid>
        {posts.map((post) => (
          <StyledCard key={post.slug}>
            {post.featuredImage?.node && (
              <StyledImageWrapper>
                <Link href={`/${post.slug}`}>
                  <Image
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.title}
                    width={post.featuredImage.node.mediaDetails.width || 400}
                    height={post.featuredImage.node.mediaDetails.height || 250}
                    style={{ objectFit: 'cover', width: '100%', height: '180px' }}
                  />
                </Link>
              </StyledImageWrapper>
            )}
            <StyledCardBody>
              <StyledCardTitle>
                <Link href={`/${post.slug}`}>{post.title}</Link>
              </StyledCardTitle>
              <StyledCardDate>
                <DateFormatter dateString={post.date} />
              </StyledCardDate>
            </StyledCardBody>
          </StyledCard>
        ))}
      </StyledGrid>
    </StyledSection>
  );
}

const StyledSection = styled.section`
  max-width: 60rem;
  margin: 3rem auto 0;
  padding: 2rem 1rem;
  border-top: 2px solid ${colours.dark};
`;

const StyledHeading = styled.h2`
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 1.5rem;
  color: ${colours.dark};
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledCard = styled.article`
  display: flex;
  flex-direction: column;
  background: #f9f9f9;
  overflow: hidden;
`;

const StyledImageWrapper = styled.div`
  overflow: hidden;

  img {
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.03);
  }
`;

const StyledCardBody = styled.div`
  padding: 0.75rem 1rem 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const StyledCardTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  letter-spacing: 1px;
  margin: 0;
  line-height: 1.4;

  a {
    color: ${colours.dark};
    text-decoration: none;

    &:hover {
      color: ${colours.pink};
    }
  }
`;

const StyledCardDate = styled.div`
  font-size: 0.8rem;
  color: #666;
`;
