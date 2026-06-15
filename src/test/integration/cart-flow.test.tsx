import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/hooks/useCart';
import { ToastProvider } from '@/hooks/useToast';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import type { Product } from '@/types';

const mockProduct: Product = {
  id: 1,
  title: 'Test Phone',
  description: 'A test phone',
  category: 'smartphones',
  price: 100,
  discountPercentage: 0,
  rating: 4.5,
  stock: 10,
  tags: [],
  brand: 'TestBrand',
  sku: 'TEST-1',
  weight: 1,
  dimensions: { width: 1, height: 1, depth: 1 },
  warrantyInformation: '1 year',
  shippingInformation: 'Free',
  availabilityStatus: 'In Stock',
  reviews: [],
  returnPolicy: '30 days',
  minimumOrderQuantity: 1,
  meta: {
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    barcode: '123',
    qrCode: 'qr',
  },
  thumbnail: 'https://example.com/phone.jpg',
  images: ['https://example.com/phone.jpg'],
};

vi.mock('@/hooks/useProducts', () => ({
  useProduct: () => ({
    data: mockProduct,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

function TestHarness() {
  const [view, setView] = useState<'detail' | 'cart'>('detail');

  return (
    <MemoryRouter initialEntries={['/product/1']}>
      <Routes>
        <Route
          path="/product/:id"
          element={
            view === 'detail' ? (
              <>
                <ProductDetailPage />
                <button type="button" onClick={() => setView('cart')}>
                  Ir al carrito
                </button>
              </>
            ) : (
              <CartPage />
            )
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <ToastProvider>
          <TestHarness />
        </ToastProvider>
      </CartProvider>
    </QueryClientProvider>,
  );
}

describe('Add to cart integration flow', () => {
  it('updates cart total after adding a product', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: /agregar al carrito/i }));
    await user.click(screen.getByRole('button', { name: /ir al carrito/i }));

    expect(screen.getByRole('heading', { name: /carrito de compras/i })).toBeInTheDocument();
    expect(screen.getByText('Test Phone')).toBeInTheDocument();
    expect(screen.getByText(/116/)).toBeInTheDocument();
  });
});
