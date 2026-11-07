import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';
import { User, AuthResponse } from '../models/user.model';

const TOKEN_KEY = 'rp_token';
const USER_KEY = 'rp_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly currentUser = signal<User | null>(this.readUser());

  readonly isAuthenticated = computed(() => !!this.token());

  constructor() {}

  signup(payload: {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    dateOfBirth: string;
    gender: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/users/signup`, payload);
  }

  signin(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/users/signin`, payload).pipe(
      tap((res) => this.persist(res))
    );
  }

  changePassword(payload: { password: string; newPassword: string }): Observable<AuthResponse> {
    return this.http.patch<AuthResponse>(`${API_BASE_URL}/users/change-password`, payload).pipe(
      tap((res) => {
        if (res?.data?.token) {
          localStorage.setItem(TOKEN_KEY, res.data.token);
          this.token.set(res.data.token);
        }
      })
    );
  }

  profileData(): Observable<{ success: boolean; data: { user: User } }> {
    return this.http.get<{ success: boolean; data: { user: User } }>(`${API_BASE_URL}/users/profile-data`).pipe(
      tap((res) => {
        if (res?.data?.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
          this.currentUser.set(res.data.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private persist(res: any): void {
    const token = res?.data?.token;
    const user = res?.data?.user;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      this.token.set(token);
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      this.currentUser.set(user);
    }
  }

  private readUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
