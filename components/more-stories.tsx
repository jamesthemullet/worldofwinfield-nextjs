import PostPreview from './post-preview';
import { MoreStoriesProps } from '../lib/types';
import styled from '@emotion/styled';

export default function MoreStories({ posts }: MoreStoriesProps) {
  return (
    <StyledSection>
      <div>
        {posts.map(({ node }) => (
          <PostPreview
            key={node.slug}
            title={node.title}
            coverImage={node.featuredImage}
            date={node.date}
            author={node.author}
            slug={node.slug}
            excerpt={node.excerpt}
            featuredImage={node.featuredImage}
          />
        ))}
      </div>
    </StyledSection>
  );
}

const StyledSection = styled.section`
  position: relative;
`;
