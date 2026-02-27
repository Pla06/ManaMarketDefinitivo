import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../common/interfaces';
import { CartLine as CartLineType } from '../../services/cartStateService';
import { cardService } from '../../services/cardService';
import { cartStateService } from '../../services/cartStateService';
import { favoritesService } from '../../services/favoritesService';
import './Home.css';

export const Home: React.FC = () => {
  const [recentCards, setRecentCards] = useState<Card[]>([]);
  const [cartItems, setCartItems] = useState<CartLineType[]>(cartStateService.getItems());
  const [favorites, setFavorites] = useState<Card[]>(favoritesService.getFavorites());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentCards();
    
    const unsubscribeCart = cartStateService.subscribe(() => {
      setCartItems(cartStateService.getItems());
    });
    
    const unsubscribeFav = favoritesService.subscribe(() => {
      setFavorites(favoritesService.getFavorites());
    });

    return () => {
      unsubscribeCart();
      unsubscribeFav();
    };
  }, []);

  const loadRecentCards = async () => {
    try {
      console.log('Iniciando carga de cartas desde:', 'http://localhost:3000/api/v1/cards/');
      const data = await cardService.getCards();
      console.log('Cartas cargadas:', data);
      setRecentCards(data.status.slice(0, 6));
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar cartas:', error);
      setRecentCards([]);
      setLoading(false);
    }
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const favoritesCount = favorites.length;

  return (
    <div className="home-container">
      <div className="container-fluid py-4">
        {/* Hero Section */}
        <div className="hero-section mb-5">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-3 fw-bold mb-3">
                🎴 Bienvenido a Mana Market
              </h1>
              <p className="lead text-white mb-4">
                Tu tienda especializada en cartas de Magic: The Gathering. Explora, colecciona y construye tu mazo perfecto.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/card/list" className="btn btn-primary btn-lg px-4">
                  📊 Ver todas las cartas
                </Link>
                <Link to="/favorites" className="btn btn-outline-light btn-lg px-4">
                  ❤️ Mis favoritos
                </Link>
              </div>
            </div>
            <div className="col-lg-4 text-center mt-4 mt-lg-0">
              <div className="stats-card">
                <div className="stat-item">
                  <div className="stat-value">{favoritesCount}</div>
                  <div className="stat-label">Favoritos</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-value">{cartItemsCount}</div>
                  <div className="stat-label">En el carrito</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Sections */}
        <div className="row g-4 mb-5">
          {/* Cart Preview */}
          <div className="col-md-6">
            <div className="section-card">
              <div className="section-header">
                <h3>🛒 Mi Carrito</h3>
                <Link to="/cart" className="view-all-link">Ver todo →</Link>
              </div>
              
              {cartItems.length === 0 ? (
                <div className="empty-state">
                  <div style={{ fontSize: '2rem' }}>🛒</div>
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="preview-list">
                  {cartItems.slice(0, 3).map(item => (
                    <div key={item.card._id} className="preview-item">
                      <img src={item.card.imageUrl} alt={item.card.name} className="preview-image" />
                      <div className="preview-info">
                        <div className="preview-name">{item.card.name}</div>
                        <div className="preview-quantity">Cantidad: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <div className="more-items">+ {cartItems.length - 3} más</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Favorites Preview */}
          <div className="col-md-6">
            <div className="section-card">
              <div className="section-header">
                <h3>❤️ Mis Favoritos</h3>
                <Link to="/favorites" className="view-all-link">Ver todo →</Link>
              </div>
              
              {favorites.length === 0 ? (
                <div className="empty-state">
                  <div style={{ fontSize: '2rem' }}>🤍</div>
                  <p>No tienes favoritos</p>
                </div>
              ) : (
                <div className="preview-list">
                  {favorites.slice(0, 3).map(card => (
                    <Link key={card._id} to={`/card/detail/${card._id}`} className="preview-item">
                      <img src={card.imageUrl} alt={card.name} className="preview-image" />
                      <div className="preview-info">
                        <div className="preview-name">{card.name}</div>
                        <div className="preview-quantity">{card.price.toFixed(2)}€</div>
                      </div>
                    </Link>
                  ))}
                  {favorites.length > 3 && (
                    <div className="more-items">+ {favorites.length - 3} más</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Cards Section */}
        <div className="recent-cards-section">
          <h3 className="mb-4 fw-bold">📋 Cartas Recientes</h3>
          {loading ? (
            <p>Cargando cartas...</p>
          ) : (
            <div className="carousel-container">
              <div className="carousel-track">
                {recentCards.map(card => (
                  <div key={card._id} className="carousel-card">
                    <Link to={`/card/detail/${card._id}`} className="card-link">
                      <div className="card">
                        <img src={card.imageUrl} className="card-img-top" alt={card.name} />
                        <div className="card-body">
                          <h5 className="card-title text-white">{card.name}</h5>
                          <p className="card-text text-light">
                            <small>{card.collection}</small>
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="h5 mb-0 text-white fw-bold">{card.price.toFixed(2)}€</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
