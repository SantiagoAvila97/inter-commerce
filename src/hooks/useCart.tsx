import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import {
  addItemToCart,
  calculateTotals,
  getCartItemQuantity,
  removeItemFromCart,
  updateItemQuantity,
} from '@/business/cartBusiness';
import type { CartItemInput, CartState, CartTotals } from '@/types';
import { EMPTY_CART } from '@/types';
import { loadCartFromStorage, saveCartToStorage } from '@/utils/cartStorage';

type CartAction =
  | { type: 'ADD'; payload: CartItemInput }
  | { type: 'REMOVE'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD':
      return addItemToCart(state, action.payload);
    case 'REMOVE':
      return removeItemFromCart(state, action.payload.productId);
    case 'UPDATE_QUANTITY':
      return updateItemQuantity(state, action.payload.productId, action.payload.quantity);
    case 'CLEAR':
      return EMPTY_CART;
    default:
      return state;
  }
}

function readInitialCartState(): CartState {
  return loadCartFromStorage();
}

interface CartContextValue {
  items: CartState['items'];
  totals: CartTotals;
  addItem: (input: CartItemInput) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, EMPTY_CART, readInitialCartState);

  useEffect(() => {
    saveCartToStorage(state);
  }, [state]);

  const totals = useMemo(() => calculateTotals(state), [state]);

  const addItem = useCallback((input: CartItemInput) => {
    dispatch({ type: 'ADD', payload: input });
  }, []);

  const removeItem = useCallback((productId: number) => {
    dispatch({ type: 'REMOVE', payload: { productId } });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const getItemQuantity = useCallback(
    (productId: number) => getCartItemQuantity(state, productId),
    [state],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      totals,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemQuantity,
    }),
    [state.items, totals, addItem, removeItem, updateQuantity, clearCart, getItemQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}
