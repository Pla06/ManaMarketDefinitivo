import { Card, InterfaceCard, InterfaceCards } from '../common/interfaces';

const getBaseUrl = (): string => {
  // En desarrollo: usa localhost:3000
  // En producción: usa la URL del backend desplegado en Vercel
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000/api/v1/cards/';
  }
  // Cambiar esto por tu URL del backend en Vercel
  return '/api/v1/cards/';
};

const BASE_URL = getBaseUrl();
const TIMEOUT = 10000; // 10 segundos timeout

export interface ApiResponse {
  status: string;
}

export interface ApiResponseGenres {
  status: string[];
}

// Helper para fetch con timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const cardService = {
  getCards: async (): Promise<InterfaceCards> => {
    const response = await fetchWithTimeout(BASE_URL);
    return response.json();
  },

  getCard: async (id: string): Promise<InterfaceCard> => {
    const response = await fetchWithTimeout(`${BASE_URL}${id}`);
    return response.json();
  },

  addCard: async (card: Omit<Card, '_id'>): Promise<ApiResponse> => {
    const response = await fetchWithTimeout(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(card),
    });
    return response.json();
  },

  updateCard: async (card: Card): Promise<ApiResponse> => {
    const response = await fetchWithTimeout(`${BASE_URL}${card._id}`, {
      method: 'PUT',
      body: JSON.stringify(card),
    });
    return response.json();
  },

  deleteCard: async (id: string): Promise<ApiResponse> => {
    const response = await fetchWithTimeout(`${BASE_URL}${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  getCollections: async (): Promise<ApiResponseGenres> => {
    const response = await fetchWithTimeout(`${BASE_URL}collections`);
    return response.json();
  },
};
