import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServiceCardService } from '../../../service/service-card.service';
import { Card } from '../../../common/interface-card';
import { CartStateService } from '../../../service/cart-state.service';
import { FavoritesService } from '../../../service/favorites.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card-detail',
  imports: [RouterLink, CommonModule],
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.css'
})
export class CardDetailComponent implements OnInit {
  private readonly cardService = inject(ServiceCardService);
  private readonly cartState = inject(CartStateService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  card: Card | null = null;
  loading = true;
  errorMessage = '';
  
  allCards: Card[] = [];
  currentIndex = -1;

  ngOnInit(): void {
    // Cargar todas las cartas primero
    this.cardService.getCards().subscribe({
      next: (data) => {
        this.allCards = data.status;
        this.loadCurrentCard();
      },
      error: () => {
        this.loadCurrentCard();
      }
    });
  }

  private loadCurrentCard(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      this.errorMessage = 'No se encontro la carta solicitada.';
      return;
    }

    this.cardService.getCard(id).subscribe({
      next: (data) => {
        this.card = data.status;
        // Encontrar el índice de la carta actual
        this.currentIndex = this.allCards.findIndex(c => c._id === this.card!._id);
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar la carta.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  addToCart(): void {
    if (!this.card) {
      return;
    }

    this.cartState.addCard(this.card, 1);
    Swal.fire({
      icon: 'success',
      title: '¡Añadido al carrito!',
      text: `${this.card.name} ha sido añadida al carrito`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  }

  toggleFavorite(): void {
    if (!this.card) {
      return;
    }
    this.favoritesService.toggleFavorite(this.card);
  }

  isFavorite(): boolean {
    return this.card ? this.favoritesService.isFavorite(this.card._id) : false;
  }

  goToNext(): void {
    if (this.currentIndex >= 0 && this.currentIndex < this.allCards.length - 1) {
      const nextCard = this.allCards[this.currentIndex + 1];
      this.router.navigate(['/card/detail', nextCard._id]).then(() => {
        this.loading = true;
        this.loadCurrentCard();
      });
    }
  }

  goToPrevious(): void {
    if (this.currentIndex > 0) {
      const prevCard = this.allCards[this.currentIndex - 1];
      this.router.navigate(['/card/detail', prevCard._id]).then(() => {
        this.loading = true;
        this.loadCurrentCard();
      });
    }
  }

  hasNext(): boolean {
    return this.currentIndex >= 0 && this.currentIndex < this.allCards.length - 1;
  }

  hasPrevious(): boolean {
    return this.currentIndex > 0;
  }
}
