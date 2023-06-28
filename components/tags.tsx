import { TagsProps } from '../lib/types';
import styled from '@emotion/styled';

export default function Tags({ tags }: TagsProps) {
  return (
    <div>
      <StyledTags>
        Tagged:
        {tags.edges.map((tag, index) => (
          <span key={index}>
            {tag.node.name}
            {index !== tags.edges.length - 1 && ',\u00A0'}
          </span>
        ))}
      </StyledTags>
    </div>
  );
}

const StyledTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 2rem;
  font-weight: 400;
  padding: 1rem;
`;
