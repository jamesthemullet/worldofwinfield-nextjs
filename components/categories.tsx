import { CategoriesProps } from '../lib/types';

export default function Categories({ categories }: CategoriesProps) {
  return (
    <span>
      under
      {Array.isArray(categories?.edges) ? (
        categories.edges.map((category, index) => <span key={index}>{category.node.name}</span>)
      ) : (
        <span>{categories?.edges.node.name}</span>
      )}
    </span>
  );
}
