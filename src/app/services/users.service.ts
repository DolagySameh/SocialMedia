import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  getSuggestions(params?: { page?: number; limit?: number }): Observable<{ success: boolean; data: { suggestions: any[] }; meta?: any }> {
    let p = new HttpParams();
    if (params?.page) p = p.set('page', params.page);
    if (params?.limit) p = p.set('limit', params.limit);
    return this.http.get<{ success: boolean; data: { suggestions: any[] }; meta?: any }>(`${API_BASE_URL}/users/suggestions`, { params: p });
  }

  follow(userId: string): Observable<{ success: boolean; data: { following: boolean; followersCount?: number } }> {
    return this.http.put<{ success: boolean; data: { following: boolean; followersCount?: number } }>(`${API_BASE_URL}/users/${userId}/follow`, {});
  }

  getProfileData(): Observable<{ success: boolean; data: { user: User } }> {
    return this.http.get<{ success: boolean; data: { user: User } }>(`${API_BASE_URL}/users/profile-data`);
  }
}
