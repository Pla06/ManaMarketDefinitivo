import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../common/interfaces';
import { favoritesService } from '../../services/favoritesService';
import { cartStateService } from '../../services/cartStateService';
import Swal from 'sweetalert2';
import './Favorites.css';

export const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Card[]>(favoritesService.getFavorites());

  useEffect(() => {
    setFavorites(favoritesService.getFavorites());
    const unsubscribe = favoritesService.subscribe(() => {
      setFavorites(favoritesService.getFavorites());
    });
    return unsubscribe;
  }, []);

  const removeFromFavorites = (cardId: string) => {
    favoritesService.removeFromFavorites(cardId);
  };

  const addToCart = (card: Card) => {
    cartStateService.addCard(card);
    Swal.fire({
      icon: 'success',
      title: '¡Añadido al carrito!',
      text: `${card.name} ha sido añadida al carrito`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const clearAll = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminarán todos los favoritos',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar todo',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      favoritesService.clear();
      await Swal.fire({
        icon: 'success',
        title: '¡Favoritos eliminados!',
        text: 'Se han eliminado todos los favoritos',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="container-fluid py-4 favorites-container">
      <div className="d-flex justify-content-between align-items-center flex-wrap p-3">
        <div>
          <h2 className="display-5 mb-0 fw-bold text-white">Mis Favoritos</h2>
          <div className="text-light">Cantidad de favoritos: {favorites.length}</div>
        </div>
        {favorites.length > 0 && (
          <button className="btn btn-danger" onClick={clearAll}>
            Limpiar todos
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state text-center py-5">
          <div className="mb-3" style={{ fontSize: '3rem' }}>🤍</div>
          <h3>No tienes favoritos</h3>
          <p className="text-light">Añade cartas a tus favoritos para verlas aquí</p>
          <Link to="/card/list" className="btn btn-primary">
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="favorites-grid p-3">
          {favorites.map(card => (
            <div key={card._id}>
              <Link to={`/card/detail/${card._id}`} className="card-link">
                <div className="card favorite-card">
                  <img src={card.imageUrl} className="card-img-top" alt={card.name} />
                  <div className="card-body">
                    <h5 className="card-title">{card.name}</h5>
                    <p className="card-text text-light">
                      <small>{card.collection} • {card.condition}</small>
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h5 mb-0">{card.price.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="mt-2 d-flex gap-2">
                <button 
                  className="btn btn-sm btn-primary flex-grow-1"
                  onClick={() => addToCart(card)}
                >
                  🛒 Añadir
                </button>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeFromFavorites(card._id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
