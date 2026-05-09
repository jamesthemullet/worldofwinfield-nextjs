import styled from '@emotion/styled';
import { PrePostProps } from '../lib/types';
import { calculateReadingTime } from './utils';

export default function PrePost({ tags, date, content }: PrePostProps) {
  const years = new Date().getFullYear() - new Date(date).getFullYear();
  const readingTime = content ? calculateReadingTime(content) : null;
  return (
    <>
      {readingTime !== null && <StyledReadingTime>{readingTime} min read</StyledReadingTime>}
      {tags.edges.map((tag, index) => (
        <div key={index}>
          {tag.node.name.includes('ExiledToryRemainerScum') && (
            <StyledNote>
              Note: Originally posted on the now-defunct Exiled Tory Remoaner Scum website
            </StyledNote>
          )}
          {tag.node.name.includes('Politics') &&
            new Date(date).getFullYear() < new Date().getFullYear() - 2 && (
              <StyledNote>
                Note: This post is {years} years old, and my politics have changed over time
              </StyledNote>
            )}
        </div>
      ))}
    </>
  );
}

const StyledReadingTime = styled.p`
  font-size: 0.85rem;
  line-height: 1.5rem;
  font-weight: 600;
  margin: 0 5rem;
  padding: 0.75rem 0 0;
  color: #666;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  @media (max-width: 768px) {
    margin: 0 1rem;
  }
`;

const StyledNote = styled.p`
  font-size: 0.8rem;
  line-height: 2rem;
  font-weight: 400;
  margin: 0 5rem;
  padding: 1rem 0;
  color: #333;
  border-bottom: 1px solid currentColor;
  @media (max-width: 768px) {
    margin: 0 1rem;
  }
`;
