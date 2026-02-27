import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../common/interfaces';
import { cardService } from '../../../services/cardService';
import { favoritesService } from '../../../services/favoritesService';
import './CardList.css';

export const CardList: React.FC = () => {
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [paginatedCards, setPaginatedCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Filtros
  const [selectedCollection, setSelectedCollection] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  
  // Ordenamiento
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(cards.length / itemsPerPage);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
    const unsubscribe = favoritesService.subscribe(() => {
      setFavorites(favoritesService.getFavorites().map(f => f._id));
    });
    return unsubscribe;
  }, []);

  const loadCards = async () => {
    try {
      const data = await cardService.getCards();
      setAllCards(data.status);
      setCards(data.status);
      extractFilters(data.status);
      setLoading(false);
    } catch (error) {
      console.error('Error carga de cards:', error);
      setLoading(false);
    }
  };

  const extractFilters = (cardsData: Card[]) => {
    const uniqueCollections = [...new Set(cardsData.map(card => card.collection))].sort();
    const uniqueConditions = [...new Set(cardsData.map(card => card.condition))].sort();
    setCollections(uniqueCollections);
    setConditions(uniqueConditions);
  };

  const applyFilters = () => {
    let filtered = [...allCards];
    
    if (selectedCollection) {
      filtered = filtered.filter(card => card.collection === selectedCollection);
    }
    
    if (selectedCondition) {
      filtered = filtered.filter(card => card.condition === selectedCondition);
    }
    
    if (minPrice !== null && minPrice > 0) {
      filtered = filtered.filter(card => card.price >= minPrice);
    }
    
    if (maxPrice !== null && maxPrice > 0) {
      filtered = filtered.filter(card => card.price <= maxPrice);
    }
    
    if (priceSort === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }
    
    setCards(filtered);
    setCurrentPage(1);
    updatePagination(filtered);
  };

  const updatePagination = (cardsData: Card[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedCards(cardsData.slice(startIndex, endIndex));
  };

  useEffect(() => {
    updatePagination(cards);
  }, [currentPage, cards]);

  useEffect(() => {
    applyFilters();
  }, [priceSort]);

  const clearFilters = () => {
    setSelectedCollection('');
    setSelectedCondition('');
    setMinPrice(null);
    setMaxPrice(null);
    setPriceSort('none');
    setCards(allCards);
    setCurrentPage(1);
    setPaginatedCards(allCards.slice(0, itemsPerPage));
  };

  const togglePriceSort = () => {
    const newSort = priceSort === 'none' ? 'asc' : priceSort === 'asc' ? 'desc' : 'none';
    setPriceSort(newSort);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const toggleFavorite = (e: React.MouseEvent, card: Card) => {
    e.preventDefault();
    e.stopPropagation();
    favoritesService.toggleFavorite(card);
    setFavorites(favoritesService.getFavorites().map(f => f._id));
  };

  const isFavorite = (cardId: string) => {
    return favorites.includes(cardId);
  };

  if (loading) {
    return <div className="container-fluid p-4">Cargando cartas...</div>;
  }

  return (
    <div className="container-fluid border border-2 rounded mt-3 mb-3 card-list-container">
      <div className="d-flex justify-content-between align-items-center flex-wrap p-3">
        <div>
          <h2 className="display-5 mb-0 fw-bold text-white">Listado de cartas</h2>
          <div className="text-light">Cantidad de cartas: {cards.length}</div>
        </div>
        <Link to="/card/add" className="btn btn-primary">Agregar carta</Link>
      </div>

      {/* Filtros */}
      <div className="filters-section p-3 border-top border-bottom border-secondary">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label text-light">Edición</label>
            <select 
              className="form-select" 
              value={selectedCollection}
              onChange={(e) => {
                setSelectedCollection(e.target.value);
                applyFilters();
              }}
            >
              <option value="">Todas las ediciones</option>
              {collections.map(collection => (
                <option key={collection} value={collection}>{collection}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label text-light">Calidad</label>
            <select 
              className="form-select" 
              value={selectedCondition}
              onChange={(e) => {
                setSelectedCondition(e.target.value);
                applyFilters();
              }}
            >
              <option value="">Todas las calidades</option>
              {conditions.map(condition => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label text-light">Precio mínimo</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="0€" 
              min="0"
              value={minPrice ?? ''}
              onChange={(e) => {
                setMinPrice(e.target.value ? Number(e.target.value) : null);
                applyFilters();
              }}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label text-light">Precio máximo</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="∞" 
              min="0"
              value={maxPrice ?? ''}
              onChange={(e) => {
                setMaxPrice(e.target.value ? Number(e.target.value) : null);
                applyFilters();
              }}
            />
          </div>
          <div className="col-md-3">
            <div className="d-flex gap-2">
              <button className="btn btn-secondary flex-grow-1" onClick={togglePriceSort}>
                {priceSort === 'none' && '📊 Ordenar por precio'}
                {priceSort === 'asc' && '⬆️ Menor a mayor'}
                {priceSort === 'desc' && '⬇️ Mayor a menor'}
              </button>
              <button className="btn btn-secondary" onClick={clearFilters}>Limpiar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Listado de cartas */}
      <div className="cards-grid p-3">
        {paginatedCards.map(card => (
          <div key={card._id}>
            <Link to={`/card/detail/${card._id}`} className="card-link">
              <div className="card card-item">
                <img src={card.imageUrl} className="card-img-top" alt={card.name} />
                <div className="card-body">
                  <h5 className="card-title">{card.name}</h5>
                  <p className="card-text text-light">
                    <small>{card.collection} • {card.condition}</small>
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 mb-0 text-white fw-bold">{card.price.toFixed(2)}€</span>
                    <button 
                      className={`btn btn-sm ${isFavorite(card._id) ? 'btn-danger' : 'btn-outline-danger'}`}
                      onClick={(e) => toggleFavorite(e, card)}
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="pagination-section p-3 border-top d-flex justify-content-center gap-2 flex-wrap">
          <button 
            className="btn btn-secondary"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Anterior
          </button>
          
          {getPageNumbers().map(page => (
            <button
              key={page}
              className={`btn ${page === currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}
          
          <button 
            className="btn btn-secondary"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};
