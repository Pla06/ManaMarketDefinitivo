import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceOrderService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly URL_BASE = 'http://localhost:3000/api/v1/orders/';

  getOrders(): Observable<ApiListResponse<Order>> {
    return this.http.get<ApiListResponse<Order>>(this.URL_BASE);
  }

  getOrder(id: string): Observable<ApiItemResponse<Order>> {
    return this.http.get<ApiItemResponse<Order>>(this.URL_BASE + id);
  }

  addOrder(order: OrderPayload): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(this.URL_BASE, order);
  }

  updateOrder(id: string, order: Partial<OrderPayload>): Observable<ApiMessageResponse> {
    return this.http.put<ApiMessageResponse>(this.URL_BASE + id, order);
  }

  deleteOrder(id: string): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.URL_BASE + id);
  }
}

export interface OrderItem {
  cardId: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderPayload {
  userId: string;
  items: OrderItem[];
  total: number;
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
