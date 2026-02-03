import { PrePostProps } from '../lib/types';
import styled from '@emotion/styled';

export default function PrePost({ tags, date }: PrePostProps) {
  const years = new Date().getFullYear() - new Date(date).getFullYear();
  return (
    <>
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
