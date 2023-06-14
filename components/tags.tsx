import { TagsProps } from '../lib/types';

export default function Tags({ tags }: TagsProps) {
  return (
    <div>
      <p>
        Tagged
        {tags.edges.map((tag, index) => (
          <span key={index}>{tag.node.name}</span>
        ))}
      </p>
    </div>
  );
}
