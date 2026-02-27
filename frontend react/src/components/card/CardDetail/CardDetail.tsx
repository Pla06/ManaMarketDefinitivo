import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '../../../common/interfaces';
import { cardService } from '../../../services/cardService';
import { cartStateService } from '../../../services/cartStateService';
import { favoritesService } from '../../../services/favoritesService';
import Swal from 'sweetalert2';
import './CardDetail.css';

export const CardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    loadCards();
    const unsubscribe = favoritesService.subscribe(() => {
      if (card) {
        setIsFav(favoritesService.isFavorite(card._id));
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (card) {
      setIsFav(favoritesService.isFavorite(card._id));
    }
  }, [card]);

  const loadCards = async () => {
    try {
      const data = await cardService.getCards();
      setAllCards(data.status);
      loadCurrentCard(data.status);
    } catch {
      loadCurrentCard([]);
    }
  };

  const loadCurrentCard = async (cards: Card[]) => {
    if (!id) {
      setLoading(false);
      setErrorMessage('No se encontro la carta solicitada.');
      return;
    }

    try {
      const data = await cardService.getCard(id);
      setCard(data.status);
      const index = cards.findIndex(c => c._id === data.status._id);
      setCurrentIndex(index);
    } catch {
      setErrorMessage('No se pudo cargar la carta.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!card) return;
    
    cartStateService.addCard(card, 1);
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

  const toggleFavorite = () => {
    if (!card) return;
    favoritesService.toggleFavorite(card);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevCard = allCards[currentIndex - 1];
      navigate(`/card/detail/${prevCard._id}`);
      setLoading(true);
      loadCards();
    }
  };

  const goToNext = () => {
    if (currentIndex >= 0 && currentIndex < allCards.length - 1) {
      const nextCard = allCards[currentIndex + 1];
      navigate(`/card/detail/${nextCard._id}`);
      setLoading(true);
      loadCards();
    }
  };

  const hasPrevious = () => currentIndex > 0;
  const hasNext = () => currentIndex >= 0 && currentIndex < allCards.length - 1;

  if (loading) {
    return (
      <div className="container-fluid my-4 detail-container">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container-fluid my-4">
        <div className="alert alert-danger" role="alert">{errorMessage}</div>
      </div>
    );
  }

  if (!card) {
    return null;
  }

  return (
    <div className="container-fluid my-4 detail-container">
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-nav" onClick={goToPrevious} disabled={!hasPrevious()}>
          ← Anterior
        </button>
        <button className="btn btn-nav" onClick={goToNext} disabled={!hasNext()}>
          Siguiente →
        </button>
      </div>

      <div className="row g-4 align-items-start">
        <div className="col-md-5 col-lg-4">
          <img className="detail-image" src={card.imageUrl} alt={card.name} />
        </div>
        <div className="col-md-7 col-lg-8">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <h2 className="display-6 mb-0 fw-bold text-white">{card.name}</h2>
            <span className="badge rarity-badge">{card.rarity}</span>
          </div>
          <p className="text-light mb-3">{card.collection} · {card.type}</p>

          <div className="info-grid">
            <div>
              <div className="label">Precio</div>
              <div className="value">{card.price.toFixed(2)}€</div>
            </div>
            <div>
              <div className="label">Stock</div>
              <div className="value">{card.stock}</div>
            </div>
            <div>
              <div className="label">Idioma</div>
              <div className="value">{card.language}</div>
            </div>
            <div>
              <div className="label">Estado</div>
              <div className="value">{card.condition}</div>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-4">
            <button className="btn btn-primary" onClick={addToCart}>
              🛒 Agregar al carrito
            </button>
            <button 
              className={`btn ${isFav ? 'btn-danger' : 'btn-outline-secondary'}`}
              onClick={toggleFavorite}
            >
              {isFav ? '❤️ Quitar de favoritos' : '🤍 Añadir a favoritos'}
            </button>
            <Link to="/card/list" className="btn btn-outline-secondary">Volver al listado</Link>
            <Link to={`/card/edit/${card._id}`} className="btn btn-edit">Editar</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
