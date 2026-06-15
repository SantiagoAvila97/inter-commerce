import type { SearchInputProps } from '@/types/components';

export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar productos…',
  id = 'catalog-search',
}: SearchInputProps) {
  return (
    <div className="search-input">
      <label htmlFor={id}>Buscar</label>
      <input
        id={id}
        type="search"
        className="search-input__field"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
