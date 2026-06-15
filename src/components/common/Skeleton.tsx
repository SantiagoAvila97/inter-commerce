export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`.trim()} aria-hidden="true" />;
}

export function ProductCardSkeleton() {
  return (
    <article className="product-card product-card--skeleton">
      <Skeleton className="skeleton--image" />
      <Skeleton className="skeleton--title" />
      <Skeleton className="skeleton--text" />
      <Skeleton className="skeleton--price" />
    </article>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="product-detail product-detail--skeleton product-detail--panel">
      <div className="product-gallery product-gallery--skeleton">
        <div className="product-gallery__thumbs">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="skeleton--gallery-thumb" />
          ))}
        </div>
        <Skeleton className="skeleton--detail-image" />
      </div>
      <div className="product-detail__info">
        <Skeleton className="skeleton--detail-title" />
        <Skeleton className="skeleton--detail-price" />
        <Skeleton className="skeleton--detail-text" />
        <Skeleton className="skeleton--detail-text" />
        <Skeleton className="skeleton--detail-button" />
      </div>
    </div>
  );
}
