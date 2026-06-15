import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AppShell } from '@/components/layout/AppShell';
import { Spinner } from '@/components/common/Spinner';
import { CartProvider, ToastProvider } from '@/hooks';
import { AppProviders } from '@/providers/AppProviders';

const CatalogPage = lazy(() =>
  import('@/pages/CatalogPage').then((module) => ({ default: module.CatalogPage })),
);
const ProductDetailPage = lazy(() =>
  import('@/pages/ProductDetailPage').then((module) => ({ default: module.ProductDetailPage })),
);
const CartPage = lazy(() =>
  import('@/pages/CartPage').then((module) => ({ default: module.CartPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
);

function PageLoader() {
  return (
    <div className="page-loader">
      <Spinner />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <CartProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<AppShell />}>
                  <Route
                    index
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <CatalogPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="product/:id"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <ProductDetailPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="cart"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <CartPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="404"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <NotFoundPage />
                      </Suspense>
                    }
                  />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </CartProvider>
      </AppProviders>
    </ErrorBoundary>
  );
}
