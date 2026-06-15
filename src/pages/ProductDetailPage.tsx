import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { QuantitySelector } from '@/components/cart/QuantitySelector';
import { ProductDetailSkeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/common/Button';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductReviews } from '@/components/product/ProductReviews';
import { ProductSpecs } from '@/components/product/ProductSpecs';
import { resolvePurchaseQuantityBounds } from '@/business/cartBusiness';
import { useCart, useProduct, useToast } from '@/hooks';
import { isNotFoundError } from '@/types';
import {
  calculateDiscountedPrice,
  formatCurrency,
  getProductImages,
  renderStarRating,
  sanitizeProductDescription,
} from '@/utils';

export function ProductDetailPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = useMemo(() => Number.parseInt(idParam ?? '', 10), [idParam]);
  const { data: product, isLoading, isError, error, refetch } = useProduct(productId);
  const { addItem, getItemQuantity } = useCart();
  const { showToast } = useToast();
  const [justAdded, setJustAdded] = useState(false);
  const [quantityToAdd, setQuantityToAdd] = useState(1);

  const quantityInCart = product ? getItemQuantity(product.id) : 0;
  const purchaseBounds = product ? resolvePurchaseQuantityBounds(product) : { min: 1, max: 1 };

  useEffect(() => {
    if (!product) {
      return;
    }

    const { min } = resolvePurchaseQuantityBounds(product);
    setQuantityToAdd(min);
  }, [product]);

  const handleAddToCart = useCallback(() => {
    if (!product) {
      return;
    }
    addItem({ product, quantity: quantityToAdd });
    setJustAdded(true);
    showToast(
      quantityToAdd === 1
        ? `${product.title} agregado al carrito`
        : `${quantityToAdd} unidades de ${product.title} agregadas al carrito`,
    );
    window.setTimeout(() => setJustAdded(false), 2_000);
  }, [addItem, product, quantityToAdd, showToast]);

  if (!Number.isFinite(productId) || productId <= 0) {
    return (
      <div className="product-detail-page">
        <ErrorState error={new Error('ID de producto inválido')} />
        <Link to="/">Volver al catálogo</Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="product-detail-page">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (isError) {
    if (isNotFoundError(error)) {
      return (
        <div className="product-detail-page">
          <h1>Producto no encontrado</h1>
          <p>El producto #{productId} no existe.</p>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Volver al catálogo
          </Button>
        </div>
      );
    }
    return (
      <div className="product-detail-page">
        <ErrorState error={error} onRetry={() => void refetch()} />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const safeDescription = sanitizeProductDescription(product.description);
  const images = getProductImages(product);
  const hasDiscount = product.discountPercentage > 0;
  const salePrice = calculateDiscountedPrice(product.price, product.discountPercentage);
  const isOutOfStock = product.stock <= 0 || product.availabilityStatus === 'Out of Stock';

  return (
    <article className="product-detail-page">
      <Link to="/" className="back-link">
        ← Volver al catálogo
      </Link>
      <header className="page-hero">
        <p className="page-eyebrow">Detalle de producto</p>
        <h1 className="page-title">{product.title}</h1>
      </header>

      <div className="product-detail product-detail--panel">
        <ProductGallery images={images} title={product.title} />
        <div className="product-detail__info">
          <span className="product-detail__category">{product.category}</span>
          <p className="product-detail__brand">{product.brand}</p>

          <div className="product-detail__pricing">
            {hasDiscount ? (
              <>
                <p className="product-detail__price product-detail__price--sale">
                  {formatCurrency(salePrice)}
                </p>
                <p className="product-detail__price product-detail__price--original">
                  {formatCurrency(product.price)}
                </p>
                <span className="product-detail__discount-badge">
                  -{product.discountPercentage.toFixed(0)}%
                </span>
              </>
            ) : (
              <p className="product-detail__price">{formatCurrency(product.price)}</p>
            )}
          </div>

          <p className="product-detail__rating">
            <span className="product-detail__stars" aria-hidden="true">
              {renderStarRating(product.rating)}
            </span>
            <span>{product.rating.toFixed(1)}</span>
            <span className="product-detail__review-count">
              · {product.reviews.length}{' '}
              {product.reviews.length === 1 ? 'reseña' : 'reseñas'}
            </span>
          </p>

          <p className="product-detail__description">{safeDescription}</p>

          {isOutOfStock ? (
            <p className="product-detail__stock product-detail__stock--out">Agotado</p>
          ) : (
            <p className="product-detail__stock">
              {product.availabilityStatus}
              {product.stock > 0 ? ` · ${product.stock} disponibles` : null}
            </p>
          )}

          <div className="product-detail__purchase">
            <QuantitySelector
              id={`product-qty-${product.id}`}
              value={quantityToAdd}
              min={purchaseBounds.min}
              max={purchaseBounds.max}
              onChange={setQuantityToAdd}
              disabled={isOutOfStock}
            />
            <Button
              onClick={handleAddToCart}
              variant={justAdded ? 'secondary' : 'primary'}
              className="product-detail__add-btn"
              disabled={isOutOfStock}
            >
              {justAdded ? '✓ Agregado' : 'Agregar al carrito'}
            </Button>
          </div>
          {quantityInCart > 0 ? (
            <p className="product-detail__cart-qty">
              {quantityInCart} en el carrito
            </p>
          ) : null}
        </div>
      </div>

      <ProductSpecs
        sku={product.sku}
        weight={product.weight}
        dimensions={product.dimensions}
        warrantyInformation={product.warrantyInformation}
        shippingInformation={product.shippingInformation}
        returnPolicy={product.returnPolicy}
        minimumOrderQuantity={product.minimumOrderQuantity}
        availabilityStatus={product.availabilityStatus}
        stock={product.stock}
        tags={product.tags}
        barcode={product.meta.barcode}
      />

      <ProductReviews reviews={product.reviews} averageRating={product.rating} />
    </article>
  );
}
