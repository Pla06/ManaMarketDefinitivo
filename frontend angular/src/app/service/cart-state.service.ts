import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Card } from '../common/interface-card';

export interface CartLine {
  card: Card;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartStateService {
  private readonly storageKey = 'mana-cart';
  private readonly itemsSubject = new BehaviorSubject<CartLine[]>(this.loadFromStorage());
  readonly items$ = this.itemsSubject.asObservable();

  addCard(card: Card, quantity = 1): void {
    const items = [...this.itemsSubject.value];
    const existing = items.find((item) => item.card._id === card._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ card, quantity });
    }
    this.updateState(items);
  }

  removeCard(cardId: string): void {
    const items = this.itemsSubject.value.filter((item) => item.card._id !== cardId);
    this.updateState(items);
  }

  updateQuantity(cardId: string, quantity: number): void {
    const items = [...this.itemsSubject.value];
    const target = items.find((item) => item.card._id === cardId);
    if (!target) {
      return;
    }
    target.quantity = Math.max(1, quantity);
    this.updateState(items);
  }

  clear(): void {
    this.updateState([]);
  }

  private updateState(items: CartLine[]): void {
    this.itemsSubject.next(items);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private loadFromStorage(): CartLine[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }
    try {
      const items = JSON.parse(raw) as CartLine[];
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  }
}
