import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, beforeEach } from 'vitest';
import { CartProvider, useCart } from '@/hooks/useCart';
import { clearCartStorage, loadCartFromStorage } from '@/utils/cartStorage';
import type { Product } from '@/types';

const product: Product = {
  id: 42,
  title: 'Test Product',
  description: 'Description',
  category: 'test',
  price: 99,
  discountPercentage: 0,
  rating: 4,
  stock: 10,
  tags: [],
  brand: 'Brand',
  sku: 'SKU-42',
  weight: 1,
  dimensions: { width: 1, height: 1, depth: 1 },
  warrantyInformation: '1 year',
  shippingInformation: 'Standard',
  availabilityStatus: 'In Stock',
  reviews: [],
  returnPolicy: '7 days',
  minimumOrderQuantity: 1,
  meta: {
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    barcode: '123',
    qrCode: 'qr',
  },
  thumbnail: 'https://example.com/item.jpg',
  images: ['https://example.com/item.jpg'],
};

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe('useCart persistence', () => {
  beforeEach(() => {
    clearCartStorage();
  });

  it('restores cart items after provider remount', () => {
    const firstMount = renderHook(() => useCart(), { wrapper });

    act(() => {
      firstMount.result.current.addItem({ product, quantity: 2 });
    });

    expect(loadCartFromStorage().items).toHaveLength(1);
    firstMount.unmount();

    const secondMount = renderHook(() => useCart(), { wrapper });

    expect(secondMount.result.current.items).toHaveLength(1);
    expect(secondMount.result.current.items[0]?.quantity).toBe(2);
    expect(secondMount.result.current.totals.itemCount).toBe(2);
  });
});
