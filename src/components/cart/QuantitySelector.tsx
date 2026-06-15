import { useCallback } from 'react';
import type { QuantitySelectorProps } from '@/types/components';
import { clampPurchaseQuantity } from '@/business/cartBusiness';

export function QuantitySelector({
  id,
  value,
  min,
  max,
  onChange,
  disabled = false,
}: QuantitySelectorProps) {
  const minimum = min ?? 1;
  const bounds = { min: minimum, max };

  const setQuantity = useCallback(
    (nextValue: number) => {
      onChange(clampPurchaseQuantity(nextValue, bounds));
    },
    [bounds, onChange],
  );

  const decrease = useCallback(() => {
    setQuantity(value - 1);
  }, [setQuantity, value]);

  const increase = useCallback(() => {
    setQuantity(value + 1);
  }, [setQuantity, value]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = Number.parseInt(event.target.value, 10);
      if (Number.isNaN(parsed)) {
        return;
      }
      setQuantity(parsed);
    },
    [setQuantity],
  );

  return (
    <div className={`quantity-selector${disabled ? ' quantity-selector--disabled' : ''}`}>
      <label className="quantity-selector__label" htmlFor={id}>
        Cantidad
      </label>
      <div className="quantity-selector__control">
        <button
          type="button"
          className="quantity-selector__btn"
          aria-label="Disminuir cantidad"
          disabled={disabled || value <= minimum}
          onClick={decrease}
        >
          −
        </button>
        <input
          id={id}
          className="quantity-selector__input"
          type="number"
          min={minimum}
          max={max}
          step={1}
          value={value}
          disabled={disabled}
          onChange={handleInputChange}
        />
        <button
          type="button"
          className="quantity-selector__btn"
          aria-label="Aumentar cantidad"
          disabled={disabled || value >= max}
          onClick={increase}
        >
          +
        </button>
      </div>
    </div>
  );
}
