import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Card } from '../common/interface-card';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly storageKey = 'mana-favorites';
  private readonly favoritesSubject = new BehaviorSubject<Card[]>(this.loadFromStorage());
  readonly favorites$ = this.favoritesSubject.asObservable();

  addToFavorites(card: Card): void {
    const favorites = [...this.favoritesSubject.value];
    const exists = favorites.find((fav) => fav._id === card._id);
    if (!exists) {
      favorites.push(card);
      this.updateState(favorites);
    }
  }

  removeFromFavorites(cardId: string): void {
    const favorites = this.favoritesSubject.value.filter((fav) => fav._id !== cardId);
    this.updateState(favorites);
  }

  toggleFavorite(card: Card): void {
    const favorites = [...this.favoritesSubject.value];
    const index = favorites.findIndex((fav) => fav._id === card._id);
    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      favorites.push(card);
    }
    this.updateState(favorites);
  }

  isFavorite(cardId: string): boolean {
    return this.favoritesSubject.value.some((fav) => fav._id === cardId);
  }

  clear(): void {
    this.updateState([]);
  }

  private updateState(favorites: Card[]): void {
    this.favoritesSubject.next(favorites);
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }

  private loadFromStorage(): Card[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }
    try {
      const favorites = JSON.parse(raw) as Card[];
      return Array.isArray(favorites) ? favorites : [];
    } catch {
      return [];
    }
  }
}
