export default function Tags({ tags }) {
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
