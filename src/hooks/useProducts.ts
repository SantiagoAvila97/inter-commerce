import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { productService } from '@/services';
import type { CatalogFilters } from '@/types';
import { CATALOG_PAGE_SIZE } from '@/types';
import { filtersToSkip } from '@/utils';

export const productQueryKeys = {
  all: ['products'] as const,
  list: (filters: CatalogFilters) =>
    [...productQueryKeys.all, 'list', filters] as const,
  infinite: (filters: Omit<CatalogFilters, 'page'>) =>
    [...productQueryKeys.all, 'infinite', filters] as const,
  detail: (id: number) => [...productQueryKeys.all, 'detail', id] as const,
  categories: () => [...productQueryKeys.all, 'categories'] as const,
};

export function useProducts(filters: CatalogFilters) {
  const skip = filtersToSkip(filters.page);

  return useQuery({
    queryKey: productQueryKeys.list(filters),
    queryFn: () =>
      productService.getProducts({
        limit: CATALOG_PAGE_SIZE,
        skip,
        q: filters.q || undefined,
        category: filters.category || undefined,
      }),
    staleTime: 60_000,
  });
}

export function useInfiniteProducts(filters: Omit<CatalogFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: productQueryKeys.infinite(filters),
    queryFn: ({ pageParam = 0 }) =>
      productService.getProducts({
        limit: CATALOG_PAGE_SIZE,
        skip: pageParam,
        q: filters.q || undefined,
        category: filters.category || undefined,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    staleTime: 60_000,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productQueryKeys.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 300_000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.name === 'NotFoundError') {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: productQueryKeys.categories(),
    queryFn: () => productService.getCategories(),
    staleTime: 600_000,
  });
}
