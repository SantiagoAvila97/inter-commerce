import { describe, expect, it } from 'vitest';
import { loadCartFromStorage, saveCartToStorage } from '@/utils/cartStorage';
import { EMPTY_CART } from '@/types';

describe('cart storage', () => {
  it('persists and restores cart state', () => {
    const state = {
      items: [
        {
          productId: 1,
          title: 'Phone',
          price: 50,
          thumbnail: 'https://example.com/phone.jpg',
          quantity: 2,
          minimumOrderQuantity: 1,
        },
      ],
    };

    saveCartToStorage(state);
    expect(loadCartFromStorage()).toEqual(state);
  });

  it('returns empty cart when storage is invalid', () => {
    window.localStorage.setItem('inter-commerce:cart', '{ invalid json');
    expect(loadCartFromStorage()).toEqual(EMPTY_CART);
  });

  it('filters invalid cart items when restoring', () => {
    window.localStorage.setItem(
      'inter-commerce:cart',
      JSON.stringify({
        version: 1,
        items: [
          {
            productId: 1,
            title: 'Phone',
            price: 50,
            thumbnail: 'https://example.com/phone.jpg',
            quantity: 2,
          },
          { productId: 'bad', quantity: 0 },
        ],
      }),
    );

    expect(loadCartFromStorage()).toEqual({
      items: [
        {
          productId: 1,
          title: 'Phone',
          price: 50,
          thumbnail: 'https://example.com/phone.jpg',
          quantity: 2,
          minimumOrderQuantity: 1,
        },
      ],
    });
  });

  it('restores legacy items without minimum order as quantity 1', () => {
    window.localStorage.setItem(
      'inter-commerce:cart',
      JSON.stringify({
        version: 1,
        items: [
          {
            productId: 2,
            title: 'Legacy',
            price: 10,
            thumbnail: 'https://example.com/legacy.jpg',
            quantity: 3,
          },
        ],
      }),
    );

    expect(loadCartFromStorage().items[0]).toEqual({
      productId: 2,
      title: 'Legacy',
      price: 10,
      thumbnail: 'https://example.com/legacy.jpg',
      quantity: 3,
      minimumOrderQuantity: 1,
    });
  });

  it('raises stored quantity to minimum order when below threshold', () => {
    window.localStorage.setItem(
      'inter-commerce:cart',
      JSON.stringify({
        version: 1,
        items: [
          {
            productId: 3,
            title: 'Bulk',
            price: 5,
            thumbnail: 'https://example.com/bulk.jpg',
            quantity: 5,
            minimumOrderQuantity: 20,
          },
        ],
      }),
    );

    expect(loadCartFromStorage().items[0]?.quantity).toBe(20);
  });
});
