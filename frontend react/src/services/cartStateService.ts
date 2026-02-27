import { Card } from '../common/interfaces';

const STORAGE_KEY = 'mana-cart';

export interface CartLine {
  card: Card;
  quantity: number;
}

class CartStateService {
  private listeners: (() => void)[] = [];

  private loadFromStorage(): CartLine[] {
    const raw = localStorage.getItem(STORAGE_KEY);
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

  private saveToStorage(items: CartLine[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getItems(): CartLine[] {
    return this.loadFromStorage();
  }

  addCard(card: Card, quantity = 1): void {
    const items = this.getItems();
    const existing = items.find(item => item.card._id === card._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ card, quantity });
    }
    this.saveToStorage(items);
    this.notifyListeners();
  }

  removeCard(cardId: string): void {
    const items = this.getItems().filter(item => item.card._id !== cardId);
    this.saveToStorage(items);
    this.notifyListeners();
  }

  updateQuantity(cardId: string, quantity: number): void {
    const items = this.getItems();
    const target = items.find(item => item.card._id === cardId);
    if (!target) {
      return;
    }
    target.quantity = Math.max(1, quantity);
    this.saveToStorage(items);
    this.notifyListeners();
  }

  clear(): void {
    this.saveToStorage([]);
    this.notifyListeners();
  }
}

export const cartStateService = new CartStateService();
