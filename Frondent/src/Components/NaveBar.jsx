import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, Menu, X } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { getCart } from '../api/api';

const iconProps = { size: 20, strokeWidth: 1.5, 'aria-hidden': 'true' };

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 50);
  const [cartCount, setCartCount] = useState(0);

  const isHome = location.pathname === '/';
  const solid = !isHome || scrolled;

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [drawerOpen]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken')?.replace(/^"|"$/g, '');
    if (!token) {
      setCartCount(0);
      return;
    }
    let cancelled = false;
    getCart(token)
      .then((res) => {
        if (cancelled) return;
        const items = res?.data?.cart_items || [];
        setCartCount(items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  const isLoggedIn = !!localStorage.getItem('accessToken');

  // Reusable scroll function pointing to /product/
  const scrollToProducts = () => {
    if (location.pathname !== '/product/') {
      navigate('/product/'); // Always navigate to /product/
      setTimeout(() => {
        document.getElementById('product-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('product-section')?.scrollIntoView({ behavior: 'smooth' });
    }
    setDrawerOpen(false);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const linkClass = ({ isActive }) => `sc-link${isActive ? ' is-active' : ''}`;

  const menuItems = (
    <>
      <NavLink to="/" className={linkClass} end>
        Home
      </NavLink>
      <button type="button" onClick={scrollToProducts} className="sc-link">
        Products
      </button>
      <NavLink to="/about" className={linkClass}>
        About
      </NavLink>
    </>
  );

  return (
    <>
      <header className={`sc-header${solid ? ' is-solid' : ''}`}>
        <nav className="sc-nav" aria-label="Main">
          {/* --- LEFT --- */}
          <div className="sc-left">
            <button
              type="button"
              className="sc-icon hamburger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="sc-mobile-menu"
            >
              <Menu {...iconProps} />
            </button>
            <div className="sc-menu">{menuItems}</div>
          </div>

          {/* --- CENTER --- */}
          <div className="sc-center">
            <NavLink to="/" className="sc-logo" aria-label="ShoeCart home">
              Shoecart
            </NavLink>
          </div>

          {/* --- RIGHT --- */}
          <div className="sc-right">
            <NavLink
              to={isLoggedIn ? '/profile' : '/register'}
              className="sc-icon"
              aria-label={isLoggedIn ? 'Your account' : 'Sign in'}
              title="Account"
            >
              <User {...iconProps} />
            </NavLink>

            <NavLink to="/cart" className="sc-icon sc-bag" aria-label="Shopping bag" title="Cart">
              <ShoppingBag {...iconProps} />
              {cartCount > 0 && (
                <span className="sc-badge" aria-hidden="true">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </NavLink>
          </div>

          <div className="sc-line" />
        </nav>
      </header>

      {!isHome && <div className="sc-spacer" aria-hidden="true" />}

      {drawerOpen && (
        <div className="sc-overlay" onClick={closeDrawer} aria-hidden="true" />
      )}

      <aside
        id="sc-mobile-menu"
        className={`sc-drawer${drawerOpen ? ' is-open' : ''}`}
        aria-label="Mobile menu"
        inert={!drawerOpen}
      >
        <div className="flex items-center justify-between">
          <span className="sc-logo sc-drawer-logo">Shoecart</span>
          <button type="button" className="sc-icon" onClick={closeDrawer} aria-label="Close menu">
            <X {...iconProps} />
          </button>
        </div>

        <div className="sc-drawer-list">{menuItems}</div>

        <div className="sc-drawer-list sc-drawer-secondary">
          <NavLink to="/cart" onClick={closeDrawer} className="sc-link">
            My Cart
          </NavLink>
          <NavLink to={isLoggedIn ? '/profile' : '/register'} onClick={closeDrawer} className="sc-link">
            Account
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default NavBar;
