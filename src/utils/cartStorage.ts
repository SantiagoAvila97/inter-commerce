import type { CartItem, CartState } from '@/types';
import { EMPTY_CART } from '@/types';

const CART_STORAGE_KEY = 'inter-commerce:cart';
const CART_SCHEMA_VERSION = 1;

interface PersistedCart {
  version: number;
  items: CartState['items'];
}

function normalizeCartItem(value: unknown): CartItem | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const item = value as Partial<CartItem>;
  const minimumOrderQuantity: number =
    Number.isInteger(item.minimumOrderQuantity) && (item.minimumOrderQuantity ?? 0) >= 1
      ? (item.minimumOrderQuantity as number)
      : 1;

  if (
    item.productId === undefined ||
    !Number.isFinite(item.productId) ||
    typeof item.title !== 'string' ||
    item.price === undefined ||
    !Number.isFinite(item.price) ||
    typeof item.thumbnail !== 'string' ||
    item.quantity === undefined ||
    !Number.isInteger(item.quantity)
  ) {
    return null;
  }

  return {
    productId: item.productId,
    title: item.title,
    price: item.price,
    thumbnail: item.thumbnail,
    minimumOrderQuantity,
    quantity: Math.max(minimumOrderQuantity, item.quantity),
  };
}

function sanitizeCartItems(items: unknown): CartItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map(normalizeCartItem)
    .filter((item): item is CartItem => item !== null);
}

export function loadCartFromStorage(): CartState {
  if (typeof window === 'undefined') {
    return EMPTY_CART;
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return EMPTY_CART;
    }

    const parsed = JSON.parse(raw) as PersistedCart;
    if (parsed.version !== CART_SCHEMA_VERSION) {
      return EMPTY_CART;
    }

    return { items: sanitizeCartItems(parsed.items) };
  } catch {
    return EMPTY_CART;
  }
}

export function saveCartToStorage(state: CartState): void {
  if (typeof window === 'undefined') {
    return;
  }

  const payload: PersistedCart = {
    version: CART_SCHEMA_VERSION,
    items: state.items,
  };

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
}

export function clearCartStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(CART_STORAGE_KEY);
}
