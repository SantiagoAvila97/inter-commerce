import { Link } from 'react-router-dom';
import { CartActions } from '@/components/cart/CartActions';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyState } from '@/components/common/EmptyState';
import { useCart } from '@/hooks';

export function CartPage() {
  const { items, totals, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <section className="cart-page">
        <header className="page-hero">
          <p className="page-eyebrow">Tu compra</p>
          <h1 className="page-title">Carrito de compras</h1>
        </header>
        <EmptyState
          title="Tu carrito está vacío"
          description="Agrega productos desde el catálogo."
          actionLabel="Ir al catálogo"
          onAction={() => {
            window.location.href = '/';
          }}
        />
      </section>
    );
  }

  return (
    <section className="cart-page">
      <header className="page-hero">
        <p className="page-eyebrow">Tu compra</p>
        <div className="cart-page__title-row">
          <h1 className="page-title">Carrito de compras</h1>
          <button type="button" className="link-btn" onClick={clearCart}>
            Vaciar carrito
          </button>
        </div>
      </header>
      <ul className="cart-page__list">
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
      <CartActions checkoutLabel="Completar pago" />
      <Link to="/" className="cart-page__continue">
        ← Seguir comprando
      </Link>
    </section>
  );
}
