import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CatalogFilters } from '@/types';
import { DEFAULT_CATALOG_FILTERS } from '@/types';
import { catalogFiltersToSearchParams, parseCatalogFilters } from '@/utils';

const DEBOUNCE_MS = 400;

export function useCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilters = useMemo(() => parseCatalogFilters(searchParams), [searchParams]);
  const [debouncedQ, setDebouncedQ] = useState(urlFilters.q);

  useEffect(() => {
    setDebouncedQ(urlFilters.q);
  }, [urlFilters.q]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (debouncedQ !== urlFilters.q) {
        updateFilters({ q: debouncedQ, page: 1 });
      }
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const updateFilters = useCallback(
    (partial: Partial<CatalogFilters>) => {
      const next: CatalogFilters = {
        ...urlFilters,
        ...partial,
      };

      if (partial.q !== undefined || partial.category !== undefined) {
        if (partial.page === undefined) {
          next.page = 1;
        }
      }

      setSearchParams(catalogFiltersToSearchParams(next), { replace: false });
    },
    [setSearchParams, urlFilters],
  );

  const setSearchQuery = useCallback((q: string) => {
    setDebouncedQ(q);
    if (q === '') {
      updateFilters({ q: '', page: 1 });
    }
  }, [updateFilters]);

  const setCategory = useCallback(
    (category: string) => {
      updateFilters({ category, page: 1 });
    },
    [updateFilters],
  );

  const setPage = useCallback(
    (page: number) => {
      updateFilters({ page: Math.max(1, page) });
    },
    [updateFilters],
  );

  const resetFilters = useCallback(() => {
    setDebouncedQ(DEFAULT_CATALOG_FILTERS.q);
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return {
    filters: urlFilters,
    debouncedQ,
    setSearchQuery,
    setCategory,
    setPage,
    resetFilters,
  };
}
