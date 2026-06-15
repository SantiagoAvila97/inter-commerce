import type { CartItem, CartItemInput, CartState, CartTotals } from '@/types';
import type { Product } from '@/types/product';
import { DEFAULT_TAX_RATE } from '@/types';

export function createCartItemFromProduct(input: CartItemInput): CartItem {
  const { product } = input;
  const minimumOrderQuantity = Math.max(1, product.minimumOrderQuantity);
  const quantity = resolveAddToCartQuantity(product, input.quantity);

  return {
    productId: product.id,
    title: product.title,
    price: product.price,
    thumbnail: product.thumbnail,
    quantity,
    minimumOrderQuantity,
  };
}

export function resolveAddToCartQuantity(
  product: Pick<Product, 'minimumOrderQuantity' | 'stock'>,
  quantity?: number,
): number {
  const bounds = resolvePurchaseQuantityBounds(product);
  const requested = quantity ?? bounds.min;

  return clampPurchaseQuantity(requested, bounds);
}

export function addItemToCart(state: CartState, input: CartItemInput): CartState {
  const quantityToAdd = resolveAddToCartQuantity(input.product, input.quantity);
  const existingIndex = state.items.findIndex((item) => item.productId === input.product.id);

  if (existingIndex === -1) {
    return {
      items: [...state.items, createCartItemFromProduct({ ...input, quantity: quantityToAdd })],
    };
  }

  const items = state.items.map((item, index) =>
    index === existingIndex
      ? {
          ...item,
          quantity: item.quantity + quantityToAdd,
          minimumOrderQuantity: Math.max(item.minimumOrderQuantity, input.product.minimumOrderQuantity),
        }
      : item,
  );

  return { items };
}

export function removeItemFromCart(state: CartState, productId: number): CartState {
  return {
    items: state.items.filter((item) => item.productId !== productId),
  };
}

export function updateItemQuantity(
  state: CartState,
  productId: number,
  quantity: number,
): CartState {
  const item = state.items.find((entry) => entry.productId === productId);
  if (!item) {
    return state;
  }

  const minQuantity = item.minimumOrderQuantity;
  const nextQuantity = Math.max(minQuantity, quantity);

  return {
    items: state.items.map((entry) =>
      entry.productId === productId ? { ...entry, quantity: nextQuantity } : entry,
    ),
  };
}

export function calculateTotals(
  state: CartState,
  taxRate: number = DEFAULT_TAX_RATE,
): CartTotals {
  const subtotal = state.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    itemCount,
    subtotal: roundCurrency(subtotal),
    tax: roundCurrency(tax),
    taxRate,
    total: roundCurrency(total),
  };
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function getCartItemQuantity(state: CartState, productId: number): number {
  return state.items.find((item) => item.productId === productId)?.quantity ?? 0;
}

export function resolvePurchaseQuantityBounds(
  product: Pick<Product, 'stock' | 'minimumOrderQuantity'>,
): { min: number; max: number } {
  const min = Math.max(1, product.minimumOrderQuantity);
  const max = product.stock > 0 ? Math.max(min, product.stock) : min;

  return { min, max };
}

export function resolveCartItemQuantityBounds(item: CartItem): { min: number; max: number } {
  return {
    min: item.minimumOrderQuantity,
    max: Number.MAX_SAFE_INTEGER,
  };
}

export function clampPurchaseQuantity(
  quantity: number,
  bounds: { min: number; max: number },
): number {
  return Math.min(bounds.max, Math.max(bounds.min, quantity));
}
