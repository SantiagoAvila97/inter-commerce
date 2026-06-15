import { memo } from 'react';
import type { CartTotals } from '@/types';
import { formatCurrency } from '@/utils';

interface CartSummaryProps {
  totals: CartTotals;
  compact?: boolean;
}

export const CartSummary = memo(function CartSummary({ totals, compact = false }: CartSummaryProps) {
  return (
    <dl className={`cart-summary ${compact ? 'cart-summary--compact' : ''}`.trim()}>
      <div className="cart-summary__row">
        <dt>Subtotal ({totals.itemCount} artículos)</dt>
        <dd>{formatCurrency(totals.subtotal)}</dd>
      </div>
      <div className="cart-summary__row">
        <dt>Impuesto ({Math.round(totals.taxRate * 100)}%)</dt>
        <dd>{formatCurrency(totals.tax)}</dd>
      </div>
      <div className="cart-summary__row cart-summary__row--total">
        <dt>Total</dt>
        <dd>{formatCurrency(totals.total)}</dd>
      </div>
    </dl>
  );
});
