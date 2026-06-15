import type { CatalogFilters } from '@/types';
import { CATALOG_PAGE_SIZE, DEFAULT_CATALOG_FILTERS } from '@/types';

export function parseCatalogFilters(searchParams: URLSearchParams): CatalogFilters {
  const q = searchParams.get('q') ?? DEFAULT_CATALOG_FILTERS.q;
  const category = searchParams.get('category') ?? DEFAULT_CATALOG_FILTERS.category;
  const pageParam = searchParams.get('page');
  const page = pageParam ? Math.max(1, Number.parseInt(pageParam, 10) || 1) : 1;

  return { q, category, page };
}

export function catalogFiltersToSearchParams(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.q.trim()) {
    params.set('q', filters.q.trim());
  }
  if (filters.category.trim()) {
    params.set('category', filters.category.trim());
  }
  if (filters.page > 1) {
    params.set('page', String(filters.page));
  }

  return params;
}

export function filtersToSkip(page: number, pageSize: number = CATALOG_PAGE_SIZE): number {
  return (page - 1) * pageSize;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function slugifyCategory(category: string): string {
  return category.trim().toLowerCase();
}

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function sanitizeProductDescription(description: string): string {
  return description.replace(/[<>]/g, '');
}

export {
  getProductImages,
  calculateDiscountedPrice,
  formatProductDate,
  formatDimensions,
  renderStarRating,
} from './productDisplay';
