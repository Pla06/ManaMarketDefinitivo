import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceUserService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly URL_BASE = 'http://localhost:3000/api/v1/users/';

  getUsers(): Observable<ApiListResponse<User>> {
    return this.http.get<ApiListResponse<User>>(this.URL_BASE);
  }

  getUser(id: string): Observable<ApiItemResponse<User>> {
    return this.http.get<ApiItemResponse<User>>(this.URL_BASE + id);
  }

  addUser(user: UserPayload): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(this.URL_BASE, user);
  }

  updateUser(id: string, user: Partial<UserPayload>): Observable<ApiMessageResponse> {
    return this.http.put<ApiMessageResponse>(this.URL_BASE + id, user);
  }

  deleteUser(id: string): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.URL_BASE + id);
  }
}

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPayload {
  name: string;
  email: string;
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
