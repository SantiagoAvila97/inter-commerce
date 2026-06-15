import type { CategoryFilterProps } from '@/types/components';

export function CategoryFilter({
  categories,
  value,
  onChange,
  id = 'catalog-category',
}: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <label htmlFor={id}>Categoría</label>
      <select
        id={id}
        className="category-filter__select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
