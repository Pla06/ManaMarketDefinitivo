import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceCartService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly URL_BASE = 'http://localhost:3000/api/v1/carts/';

  getCarts(): Observable<ApiListResponse<Cart>> {
    return this.http.get<ApiListResponse<Cart>>(this.URL_BASE);
  }

  getCart(id: string): Observable<ApiItemResponse<Cart>> {
    return this.http.get<ApiItemResponse<Cart>>(this.URL_BASE + id);
  }

  addCart(cart: CartPayload): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(this.URL_BASE, cart);
  }

  updateCart(id: string, cart: Partial<CartPayload>): Observable<ApiMessageResponse> {
    return this.http.put<ApiMessageResponse>(this.URL_BASE + id, cart);
  }

  deleteCart(id: string): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.URL_BASE + id);
  }
}

export interface CartItem {
  cardId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartPayload {
  userId: string;
  items: CartItem[];
  status?: string;
}

export interface ApiListResponse<T> {
  status: T[];
}

export interface ApiItemResponse<T> {
  status: T;
}

export interface ApiMessageResponse {
  status: string;
}
