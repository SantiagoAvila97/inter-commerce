import { CartActions } from './CartActions';
import { CartItemRow } from './CartItemRow';
import { CartSummary } from './CartSummary';
import { useCart } from '@/hooks';
import { EmptyState } from '@/components/common/EmptyState';
import type { CartDrawerProps } from '@/types/components';

export function CartPanel({ onClose }: { onClose?: () => void }) {
  const { items, totals, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Tu carrito está vacío"
        description="Explora el catálogo y agrega productos."
        actionLabel="Ir al catálogo"
        onAction={onClose}
      />
    );
  }

  return (
    <div className="cart-panel">
      <ul className="cart-panel__list">
        {items.map((item) => (
          <CartItemRow
            key={item.productId}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </ul>
      <CartSummary totals={totals} />
      <CartActions onClose={onClose} showFullCartLink checkoutLabel="Pago rápido" />
    </div>
  );
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="cart-drawer__backdrop" onClick={onClose} aria-hidden="true" />
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        <header className="cart-drawer__header">
          <h2>Carrito</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar carrito">
            ×
          </button>
        </header>
        <CartPanel onClose={onClose} />
      </aside>
    </>
  );
}
