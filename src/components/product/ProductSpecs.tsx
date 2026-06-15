import type { ProductSpecsProps } from '@/types/components';
import { formatDimensions } from '@/utils';

export function ProductSpecs({
  sku,
  weight,
  dimensions,
  warrantyInformation,
  shippingInformation,
  returnPolicy,
  minimumOrderQuantity,
  availabilityStatus,
  stock,
  tags,
  barcode,
}: ProductSpecsProps) {
  const availabilityClass =
    availabilityStatus === 'In Stock'
      ? 'product-specs__status--in-stock'
      : availabilityStatus === 'Low Stock'
        ? 'product-specs__status--low-stock'
        : 'product-specs__status--out-of-stock';

  return (
    <section className="product-specs surface-panel">
      <h2 className="product-specs__title">Información del producto</h2>
      <dl className="product-specs__grid">
        <div className="product-specs__item">
          <dt>SKU</dt>
          <dd>{sku}</dd>
        </div>
        <div className="product-specs__item">
          <dt>Disponibilidad</dt>
          <dd>
            <span className={`product-specs__status ${availabilityClass}`}>
              {availabilityStatus}
            </span>
            {stock >= 0 ? ` · ${stock} en inventario` : null}
          </dd>
        </div>
        <div className="product-specs__item">
          <dt>Peso</dt>
          <dd>{weight} kg</dd>
        </div>
        <div className="product-specs__item">
          <dt>Dimensiones</dt>
          <dd>{formatDimensions(dimensions)}</dd>
        </div>
        <div className="product-specs__item">
          <dt>Garantía</dt>
          <dd>{warrantyInformation}</dd>
        </div>
        <div className="product-specs__item">
          <dt>Envío</dt>
          <dd>{shippingInformation}</dd>
        </div>
        <div className="product-specs__item">
          <dt>Devoluciones</dt>
          <dd>{returnPolicy}</dd>
        </div>
        <div className="product-specs__item">
          <dt>Pedido mínimo</dt>
          <dd>{minimumOrderQuantity} unidad{minimumOrderQuantity === 1 ? '' : 'es'}</dd>
        </div>
        <div className="product-specs__item">
          <dt>Código de barras</dt>
          <dd>{barcode}</dd>
        </div>
      </dl>
      {tags.length > 0 ? (
        <div className="product-specs__tags">
          <p className="product-specs__tags-label">Etiquetas</p>
          <ul className="product-specs__tag-list">
            {tags.map((tag) => (
              <li key={tag} className="product-specs__tag">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
