import { describe, expect, it } from 'vitest';
import { catalogFiltersToSearchParams, parseCatalogFilters } from '@/utils';

describe('catalog URL filters', () => {
  it('parses and serializes search params', () => {
    const params = new URLSearchParams('q=phone&category=smartphones&page=2');
    const filters = parseCatalogFilters(params);

    expect(filters).toEqual({
      q: 'phone',
      category: 'smartphones',
      page: 2,
    });

    const serialized = catalogFiltersToSearchParams(filters);
    expect(serialized.toString()).toBe('q=phone&category=smartphones&page=2');
  });

  it('uses defaults when params are missing', () => {
    const filters = parseCatalogFilters(new URLSearchParams());
    expect(filters).toEqual({ q: '', category: '', page: 1 });
  });
});
