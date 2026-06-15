import type { Product } from './product';

export interface CartItem {
  productId: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  minimumOrderQuantity: number;
}

export interface CartState {
  items: CartItem[];
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
}

export interface CartItemInput {
  product: Product;
  quantity?: number;
}

export const EMPTY_CART: CartState = { items: [] };

export const DEFAULT_TAX_RATE = 0.16;
