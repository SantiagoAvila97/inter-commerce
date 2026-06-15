import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { useCart, useToast } from '@/hooks';
import { formatCurrency } from '@/utils';

interface CartActionsProps {
  onClose?: () => void;
  showFullCartLink?: boolean;
  checkoutLabel: string;
}

export function CartActions({
  onClose,
  showFullCartLink = false,
  checkoutLabel,
}: CartActionsProps) {
  const navigate = useNavigate();
  const { totals } = useCart();
  const { showToast } = useToast();

  const handleCheckout = useCallback(() => {
    showToast(
      `Pago demostrativo por ${formatCurrency(totals.total)} registrado. ¡Gracias por probar InterCommerce!`,
      'success',
    );
    onClose?.();
  }, [onClose, showToast, totals.total]);

  const handleViewFullCart = useCallback(() => {
    onClose?.();
    void navigate('/cart');
  }, [navigate, onClose]);

  return (
    <div className="cart-actions">
      {showFullCartLink ? (
        <Button variant="primary" className="cart-actions__btn" onClick={handleViewFullCart}>
          Ver carrito completo
        </Button>
      ) : null}
      <Button variant="primary" className="cart-actions__btn" onClick={handleCheckout}>
        {checkoutLabel}
      </Button>
    </div>
  );
}
