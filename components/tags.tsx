import { TagsProps } from '../lib/types';
import styled from '@emotion/styled';
import Link from 'next/link';

export default function Tags({ tags }: TagsProps) {
  // remove tags with a space because I cannot retrieve them from the API
  tags.edges = tags.edges.filter((tag) => tag.node.name.indexOf(' ') === -1);
  return (
    <div>
      <StyledTags>
        Tagged:
        {tags.edges.map((tag, index) => (
          <span key={index}>
            <Link href={`/tags/${encodeURIComponent(tag.node.name)}`} aria-label={tag.node.name}>
              {tag.node.name}
            </Link>
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
