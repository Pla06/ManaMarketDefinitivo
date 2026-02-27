import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../service/favorites.service';
import { CartStateService } from '../../service/cart-state.service';
import { Card } from '../../common/interface-card';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  private readonly favoritesService = inject(FavoritesService);
  private readonly cartState = inject(CartStateService);

  favorites$ = this.favoritesService.favorites$;

  removeFromFavorites(cardId: string): void {
    this.favoritesService.removeFromFavorites(cardId);
  }

  addToCart(card: Card): void {
    this.cartState.addCard(card);
    Swal.fire({
      icon: 'success',
      title: '¡Añadido al carrito!',
      text: `${card.name} ha sido añadida al carrito`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  }

  clearAll(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminarán todos los favoritos',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar todo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.favoritesService.clear();
        Swal.fire({
          icon: 'success',
          title: '¡Favoritos eliminados!',
          text: 'Se han eliminado todos los favoritos',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
}
