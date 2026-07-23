import styled from '@emotion/styled';
import Link from 'next/link';
import type { JSX } from 'react';
import type { TagsProps } from '../lib/types';

export default function Tags({ tags }: TagsProps): JSX.Element {
  // remove tags with a space because I cannot retrieve them from the API
  const filteredEdges = tags.edges.filter((tag) => tag.node.name.indexOf(' ') === -1);
  return (
    <nav aria-label="Post tags">
      <StyledTags>
        Tagged:
        {filteredEdges.map((tag, index) => (
          <span key={index}>
            <Link href={`/tags/${encodeURIComponent(tag.node.name)}`} aria-label={tag.node.name}>
              {tag.node.name}
            </Link>
            {index !== filteredEdges.length - 1 && ',\u00A0'}
          </span>
        ))}
      </StyledTags>
    </nav>
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
