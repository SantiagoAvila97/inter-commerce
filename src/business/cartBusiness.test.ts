import { describe, expect, it } from 'vitest';
import {
  addItemToCart,
  calculateTotals,
  clampPurchaseQuantity,
  removeItemFromCart,
  resolvePurchaseQuantityBounds,
  updateItemQuantity,
} from '@/business/cartBusiness';
import { EMPTY_CART } from '@/types';
import type { Product } from '@/types';

const product: Product = {
  id: 10,
  title: 'Laptop',
  description: 'Powerful laptop',
  category: 'laptops',
  price: 200,
  discountPercentage: 0,
  rating: 4,
  stock: 5,
  tags: [],
  brand: 'Tech',
  sku: 'LAP-10',
  weight: 2,
  dimensions: { width: 30, height: 2, depth: 20 },
  warrantyInformation: '2 years',
  shippingInformation: 'Express',
  availabilityStatus: 'In Stock',
  reviews: [],
  returnPolicy: '15 days',
  minimumOrderQuantity: 1,
  meta: {
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    barcode: '999',
    qrCode: 'qr',
  },
  thumbnail: 'https://example.com/laptop.jpg',
  images: ['https://example.com/laptop.jpg'],
};

describe('cartBusiness', () => {
  it('adds items and calculates totals with tax', () => {
    const state = addItemToCart(EMPTY_CART, { product, quantity: 2 });
    const totals = calculateTotals(state);

    expect(totals.itemCount).toBe(2);
    expect(totals.subtotal).toBe(400);
    expect(totals.tax).toBe(64);
    expect(totals.total).toBe(464);
  });

  it('merges duplicate products by increasing quantity', () => {
    const first = addItemToCart(EMPTY_CART, { product });
    const second = addItemToCart(first, { product, quantity: 2 });

    expect(second.items).toHaveLength(1);
    expect(second.items[0]?.quantity).toBe(3);
  });

  it('removes items and updates quantity', () => {
    const withItem = addItemToCart(EMPTY_CART, { product, quantity: 3 });
    const updated = updateItemQuantity(withItem, product.id, 1);
    const removed = removeItemFromCart(updated, product.id);

    expect(updated.items[0]?.quantity).toBe(1);
    expect(removed.items).toHaveLength(0);
  });

  it('resolves purchase quantity bounds from stock and minimum order', () => {
    expect(resolvePurchaseQuantityBounds(product)).toEqual({ min: 1, max: 5 });
    expect(
      resolvePurchaseQuantityBounds({ ...product, minimumOrderQuantity: 3, stock: 10 }),
    ).toEqual({ min: 3, max: 10 });
  });

  it('clamps purchase quantity within bounds', () => {
    const bounds = { min: 2, max: 8 };
    expect(clampPurchaseQuantity(1, bounds)).toBe(2);
    expect(clampPurchaseQuantity(5, bounds)).toBe(5);
    expect(clampPurchaseQuantity(20, bounds)).toBe(8);
  });

  it('adds at least the minimum order quantity from catalog', () => {
    const wholesaleProduct = { ...product, minimumOrderQuantity: 20, stock: 100 };
    const state = addItemToCart(EMPTY_CART, { product: wholesaleProduct });

    expect(state.items[0]?.quantity).toBe(20);
    expect(state.items[0]?.minimumOrderQuantity).toBe(20);
  });

  it('does not allow cart quantity below minimum order', () => {
    const wholesaleProduct = { ...product, minimumOrderQuantity: 20, stock: 100 };
    const withItem = addItemToCart(EMPTY_CART, { product: wholesaleProduct });
    const updated = updateItemQuantity(withItem, product.id, 5);

    expect(updated.items[0]?.quantity).toBe(20);
  });
});
