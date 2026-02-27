import { Card } from '../common/interfaces';

const STORAGE_KEY = 'mana-favorites';

class FavoritesService {
  private listeners: (() => void)[] = [];

  private loadFromStorage(): Card[] {
    const raw = localStorage.getItem(STORAGE_KEY);
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

  private saveToStorage(favorites: Card[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
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

  getFavorites(): Card[] {
    return this.loadFromStorage();
  }

  addToFavorites(card: Card): void {
    const favorites = this.getFavorites();
    const exists = favorites.find(fav => fav._id === card._id);
    if (!exists) {
      favorites.push(card);
      this.saveToStorage(favorites);
      this.notifyListeners();
    }
  }

  removeFromFavorites(cardId: string): void {
    const favorites = this.getFavorites().filter(fav => fav._id !== cardId);
    this.saveToStorage(favorites);
    this.notifyListeners();
  }

  toggleFavorite(card: Card): void {
    const favorites = this.getFavorites();
    const index = favorites.findIndex(fav => fav._id === card._id);
    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      favorites.push(card);
    }
    this.saveToStorage(favorites);
    this.notifyListeners();
  }

  isFavorite(cardId: string): boolean {
    return this.getFavorites().some(fav => fav._id === cardId);
  }

  clear(): void {
    this.saveToStorage([]);
    this.notifyListeners();
  }
}

export const favoritesService = new FavoritesService();
