/**
 * Componente que muestra la lista de cartas.
 * Permite filtrar, ordenar, paginar y marcar como favorito.
 */
import {Component, inject}from '@angular/core';
import {ServiceCardService} from '../../../service/service-card.service';
import {Card} from '../../../common/interface-card';
import {RouterLink} from '@angular/router';
import {CurrencyPipe} from '@angular/common';
import {FavoritesService} from '../../../service/favorites.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-card-list',
  imports: [
    RouterLink,
    CurrencyPipe,
    FormsModule
  ],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css'
})
export class CardListComponent {
  private readonly cardService: ServiceCardService = inject(ServiceCardService);
  private readonly favoritesService = inject(FavoritesService);
  
  // Exponer Math para el template
  Math = Math;
  
  allCards: Card[] = [];
  cards: Card[] = [];
  paginatedCards: Card[] = [];
  collections: string[] = [];
  conditions: string[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  
  // Filtros
  selectedCollection = '';
  selectedCondition = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  
  // Ordenamiento
  priceSort: 'none' | 'asc' | 'desc' = 'none';
  
  // Paginación
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;
  
  constructor() {
    this.loadCards();
  }

  private loadCards() {
    this.isLoading = true;
    this.errorMessage = null;
    this.cardService.getCards().subscribe(
      {
        next: data =>{
          this.allCards = data.status;
          this.cards = [...this.allCards];
          this.extractFilters();
          this.updatePagination();
          this.isLoading = false;
          console.log(`Loaded ${this.allCards.length} cards successfully`);
        },
        error: err =>{
          console.error('Error carga de cards:', err);
          this.errorMessage = `Error al cargar las cartas: ${err.message || 'Error desconocido'}`;
          this.isLoading = false;
        },
        complete:() =>{
          console.log('Card List cargada correctamente');
        }
      }
    )
  }

  private extractFilters() {
    // Extraer colecciones únicas
    this.collections = [...new Set(this.allCards.map(card => card.collection))].sort();
    // Extraer condiciones únicas
    this.conditions = [...new Set(this.allCards.map(card => card.condition))].sort();
  }

  private updatePagination() {
    this.totalPages = Math.ceil(this.cards.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCards = this.cards.slice(startIndex, endIndex);
  }

  applyFilters() {
    let filtered = [...this.allCards];
    
    // Filtrar por colección
    if (this.selectedCollection) {
      filtered = filtered.filter(card => card.collection === this.selectedCollection);
    }
    
    // Filtrar por condición
    if (this.selectedCondition) {
      filtered = filtered.filter(card => card.condition === this.selectedCondition);
    }
    
    // Filtrar por precio mínimo
    if (this.minPrice !== null && this.minPrice > 0) {
      filtered = filtered.filter(card => card.price >= this.minPrice!);
    }
    
    // Filtrar por precio máximo
    if (this.maxPrice !== null && this.maxPrice > 0) {
      filtered = filtered.filter(card => card.price <= this.maxPrice!);
    }
    
    // Aplicar ordenamiento
    if (this.priceSort === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.priceSort === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }
    
    this.cards = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  clearFilters() {
    this.selectedCollection = '';
    this.selectedCondition = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.priceSort = 'none';
    this.cards = [...this.allCards];
    this.currentPage = 1;
    this.updatePagination();
  }

  togglePriceSort() {
    if (this.priceSort === 'none') {
      this.priceSort = 'asc';
    } else if (this.priceSort === 'asc') {
      this.priceSort = 'desc';
    } else {
      this.priceSort = 'none';
    }
    this.applyFilters();
  }

  // Métodos de paginación
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, this.currentPage - halfVisible);
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  toggleFavorite(event: Event, card: Card): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoritesService.toggleFavorite(card);
  }

  isFavorite(cardId: string): boolean {
    return this.favoritesService.isFavorite(cardId);
  }
}
