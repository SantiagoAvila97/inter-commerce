import { useCallback, useMemo } from 'react';
import { CategoryFilter } from '@/components/catalog/CategoryFilter';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { SearchInput } from '@/components/catalog/SearchInput';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ProductGridSkeleton } from '@/components/common/Skeleton';
import { Spinner } from '@/components/common/Spinner';
import { resolveAddToCartQuantity } from '@/business/cartBusiness';
import {
  useCatalogFilters,
  useCategories,
  useInfiniteProducts,
  useCart,
  useToast,
} from '@/hooks';
import type { Product } from '@/types';

export function CatalogPage() {
  const { filters, debouncedQ, setSearchQuery, setCategory, resetFilters } = useCatalogFilters();
  const { data: categories = [] } = useCategories();
  const queryFilters = useMemo(
    () => ({ q: filters.q, category: filters.category }),
    [filters.q, filters.category],
  );

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts(queryFilters);

  const { addItem } = useCart();
  const { showToast } = useToast();

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data],
  );

  const handleAddToCart = useCallback(
    (productId: number) => {
      const product = products.find((item) => item.id === productId);
      if (!product) {
        showToast('No se pudo agregar el producto', 'error');
        return;
      }
      addItem({ product });
      const quantityAdded = resolveAddToCartQuantity(product);
      showToast(
        quantityAdded === 1
          ? `${product.title} agregado al carrito`
          : `${quantityAdded} unidades de ${product.title} agregadas al carrito`,
      );
    },
    [addItem, products, showToast],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <section className="catalog-page">
      <header className="catalog-hero">
        <p className="page-eyebrow">Inter Commerce</p>
        <h1 className="page-title">Catálogo de productos</h1>
        <p className="page-subtitle">
          Explora productos con filtros sincronizados en la URL para compartir y recargar sin perder
          tu búsqueda.
        </p>
      </header>

      <div className="catalog-page__filters surface-panel">
        <SearchInput value={debouncedQ} onChange={setSearchQuery} />
        <CategoryFilter
          categories={categories}
          value={filters.category}
          onChange={setCategory}
        />
        {(filters.q || filters.category) && (
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="catalog-page__clear-filters"
            onClick={resetFilters}
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {isLoading ? <ProductGridSkeleton /> : null}

      {isError ? <ErrorState error={error} onRetry={() => void refetch()} /> : null}

      {!isLoading && !isError && products.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="Prueba con otros términos o categorías."
          actionLabel="Limpiar filtros"
          onAction={resetFilters}
        />
      ) : null}

      {!isLoading && !isError && products.length > 0 ? (
        <>
          <ProductGrid>
            {products.map((product: Product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                thumbnail={product.thumbnail}
                images={product.images}
                category={product.category}
                minimumOrderQuantity={product.minimumOrderQuantity}
                onAddToCart={handleAddToCart}
              />
            ))}
          </ProductGrid>

          <div className="catalog-page__pagination">
            {hasNextPage ? (
              <Button
                variant="primary"
                onClick={handleLoadMore}
                isLoading={isFetchingNextPage}
                className="catalog-page__load-more"
              >
                Cargar más productos
              </Button>
            ) : (
              <p className="catalog-page__end">Has visto todos los productos disponibles.</p>
            )}
            {isFetchingNextPage ? (
              <div className="catalog-page__loading-more">
                <Spinner label="Cargando más productos" />
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </section>
  );
}
