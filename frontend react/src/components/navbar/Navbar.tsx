import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cartStateService } from '../../services/cartStateService';
import { favoritesService } from '../../services/favoritesService';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const [cartCount, setCartCount] = useState(cartStateService.getItems().length);
  const [favCount, setFavCount] = useState(favoritesService.getFavorites().length);
  const location = useLocation();

  useEffect(() => {
    setCartCount(cartStateService.getItems().length);
    setFavCount(favoritesService.getFavorites().length);

    const unsubscribeCart = cartStateService.subscribe(() => {
      setCartCount(cartStateService.getItems().length);
    });

    const unsubscribeFav = favoritesService.subscribe(() => {
      setFavCount(favoritesService.getFavorites().length);
    });

    return () => {
      unsubscribeCart();
      unsubscribeFav();
    };
  }, []);

  const isActive = (path: string) => location.pathname === path ? 'active-top' : '';

  return (
    <nav className="top-navbar">
      <div className="container-fluid px-4 py-2">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/home" className="brand-link text-white text-decoration-none d-flex align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-card-image" viewBox="0 0 16 16">
              <path d="M6.002 0a2 2 0 0 0-2 2v8.002a2 2 0 0 0 2 2h8.002a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5 2a1 1 0 0 1 1-1h8.002a1 1 0 0 1 1 1v6.002l-2.5-2.5a.5.5 0 0 0-.707 0l-2.647 2.646L8.5 6.793a.5.5 0 0 0-.707 0L5 9.586z"/>
              <path d="M2 2a2 2 0 0 1 2-2h8.002v1H4a1 1 0 0 0-1 1v8.002H2z"/>
            </svg>
            <span className="fs-3 fw-bold">Mana Market</span>
          </Link>
          <div className="d-flex gap-3 align-items-center">
            <Link to="/home" className={`nav-link-top text-white ${isActive('/home')}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-fill me-1" viewBox="0 0 16 16">
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
                <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
              </svg>
              Inicio
            </Link>
            <Link to="/card/list" className={`nav-link-top text-white ${isActive('/card/list')}`}>
              Catálogo
            </Link>
            <Link to="/favorites" className={`nav-link-top text-white d-flex align-items-center gap-1 ${isActive('/favorites')}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
              </svg>
              Favoritos {favCount > 0 && <span className="badge bg-danger">{favCount}</span>}
            </Link>
            <Link to="/card/add" className={`nav-link-top text-white ${isActive('/card/add')}`}>
              Nueva carta
            </Link>
            <Link to="/cart" className={`nav-link-top text-white d-flex align-items-center gap-1 ${isActive('/cart')}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1.5 7A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.49-.402L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5"/>
                <path d="M3.5 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2m8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
              </svg>
              Carrito {cartCount > 0 && <span className="badge bg-danger">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </div>
      <div className="navbar-magic"></div>
    </nav>
  );
};
