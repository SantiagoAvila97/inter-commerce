import { useCallback, useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ToastContainer } from '@/components/common/ToastContainer';
import { CartIcon, Footer, HeaderLogo } from '@/components/layout/Footer';
import { HeaderAuthorMenu } from '@/components/layout/HeaderAuthorMenu';
import { useCart } from '@/hooks';

export function AppShell() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totals } = useCart();

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <HeaderLogo />
          <nav className="app-header__nav" aria-label="Principal">
            <NavLink to="/" className="app-header__link" end>
              Catálogo
            </NavLink>
            <HeaderAuthorMenu />
            <button type="button" className="icon-btn cart-trigger" onClick={openCart}>
              <CartIcon />
              {totals.itemCount > 0 ? (
                <span className="badge">{totals.itemCount}</span>
              ) : null}
              <span className="sr-only">Abrir carrito</span>
            </button>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <ToastContainer />
    </div>
  );
}
