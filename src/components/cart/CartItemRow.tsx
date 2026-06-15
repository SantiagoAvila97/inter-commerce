import { memo, useCallback } from 'react';
import type { CartItem } from '@/types';
import { formatCurrency } from '@/utils';
import { TrashIcon } from '@/components/cart/TrashIcon';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export const CartItemRow = memo(function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const canDecrease = item.quantity > item.minimumOrderQuantity;

  const decrease = useCallback(() => {
    if (!canDecrease) {
      return;
    }
    onUpdateQuantity(item.productId, item.quantity - 1);
  }, [canDecrease, item.productId, item.quantity, onUpdateQuantity]);

  const increase = useCallback(() => {
    onUpdateQuantity(item.productId, item.quantity + 1);
  }, [item.productId, item.quantity, onUpdateQuantity]);

  const remove = useCallback(() => {
    onRemove(item.productId);
  }, [item.productId, onRemove]);

  return (
    <li className="cart-item">
      <img src={item.thumbnail} alt="" className="cart-item__thumb" />
      <div className="cart-item__info">
        <p className="cart-item__title">{item.title}</p>
        <p className="cart-item__price">{formatCurrency(item.price)}</p>
        {item.minimumOrderQuantity > 1 ? (
          <p className="cart-item__min-order">
            Pedido mín. {item.minimumOrderQuantity} unidades
          </p>
        ) : null}
      </div>
      <div className="cart-item__controls">
        <button
          type="button"
          className="qty-btn"
          onClick={decrease}
          disabled={!canDecrease}
          aria-label="Disminuir cantidad"
        >
          −
        </button>
        <span className="cart-item__qty">{item.quantity}</span>
        <button type="button" className="qty-btn" onClick={increase} aria-label="Aumentar cantidad">
          +
        </button>
      </div>
      <button
        type="button"
        className="cart-item__remove"
        onClick={remove}
        aria-label={`Eliminar ${item.title}`}
      >
        <TrashIcon />
      </button>
    </li>
  );
});
