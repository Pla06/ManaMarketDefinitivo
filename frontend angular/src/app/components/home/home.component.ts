import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServiceCardService } from '../../service/service-card.service';
import { CartStateService, CartLine } from '../../service/cart-state.service';
import { FavoritesService } from '../../service/favorites.service';
import { Card } from '../../common/interface-card';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private readonly cardService = inject(ServiceCardService);
  private readonly cartState = inject(CartStateService);
  private readonly favoritesService = inject(FavoritesService);

  recentCards: Card[] = [];
  cartItems$ = this.cartState.items$;
  favorites$ = this.favoritesService.favorites$;
  cartItemsCount$ = this.cartState.items$.pipe(
    map((items: CartLine[]) => items.reduce((sum: number, item: CartLine) => sum + item.quantity, 0))
  );
  favoritesCount$ = this.favoritesService.favorites$.pipe(
    map((favs: Card[]) => favs.length)
  );

  ngOnInit(): void {
    this.loadRecentCards();
  }

  loadRecentCards(): void {
    this.cardService.getCards().subscribe({
      next: (response) => {
        // Mostrar solo las primeras 6 cartas
        this.recentCards = response.status.slice(0, 6);
      },
      error: (error) => {
        console.error('Error al cargar cartas:', error);
      }
    });
  }
}
