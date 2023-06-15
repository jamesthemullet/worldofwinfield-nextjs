import PostPreview from './post-preview';
import { MoreStoriesProps } from '../lib/types';

export default function MoreStories({ posts }: MoreStoriesProps) {
  return (
    <section>
      <h2>More Stories</h2>
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
          />
        ))}
      </div>
    </section>
  );
}
