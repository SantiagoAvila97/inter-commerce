import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ProductCardMedia } from '@/components/catalog/ProductCardMedia';
import type { ProductCardProps } from '@/types/components';
import { formatCurrency } from '@/utils';
import { Button } from '@/components/common/Button';

export const ProductCard = memo(function ProductCard({
  id,
  title,
  price,
  thumbnail,
  images,
  category,
  minimumOrderQuantity,
  onAddToCart,
}: ProductCardProps) {
  const handleAddToCart = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      onAddToCart(id);
    },
    [id, onAddToCart],
  );

  return (
    <article className="product-card card-hover">
      <Link to={`/product/${id}`} className="product-card__media-link">
        <ProductCardMedia images={images} thumbnail={thumbnail} title={title} />
      </Link>
      <div className="product-card__footer">
        <Link to={`/product/${id}`} className="product-card__body">
          <span className="product-card__category">{category}</span>
          <h3 className="product-card__title">{title}</h3>
          <p className="product-card__price">{formatCurrency(price)}</p>
          <p
            className={`product-card__min-order${minimumOrderQuantity > 1 ? ' product-card__min-order--highlight' : ''}`}
          >
            Pedido mín. {minimumOrderQuantity}{' '}
            {minimumOrderQuantity === 1 ? 'unidad' : 'unidades'}
          </p>
        </Link>
        <Button
          size="sm"
          variant="outline"
          className="product-card__add-btn"
          onClick={handleAddToCart}
        >
          Agregar
        </Button>
      </div>
    </article>
  );
});
