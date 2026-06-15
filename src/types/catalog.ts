export interface CatalogFilters {
  q: string;
  category: string;
  page: number;
}

export interface CatalogSearchParams {
  q?: string;
  category?: string;
  page?: string;
}

export const DEFAULT_CATALOG_FILTERS: CatalogFilters = {
  q: '',
  category: '',
  page: 1,
};

export const CATALOG_PAGE_SIZE = 12;

export interface ProductsQueryParams {
  limit: number;
  skip: number;
  q?: string;
  category?: string;
}
