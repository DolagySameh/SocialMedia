import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';
import { Post, PostsResponse, PostResponse } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);

  getAll(params?: { page?: number; limit?: number }): Observable<PostsResponse> {
    let p = new HttpParams();
    if (params?.page) p = p.set('page', params.page);
    if (params?.limit) p = p.set('limit', params.limit);
    return this.http.get<PostsResponse>(`${API_BASE_URL}/posts`, { params: p });
  }

  getFeed(params?: { only?: string; page?: number; limit?: number }): Observable<PostsResponse> {
    let p = new HttpParams();
    if (params?.only) p = p.set('only', params.only);
    if (params?.page) p = p.set('page', params.page);
    if (params?.limit) p = p.set('limit', params.limit);
    return this.http.get<PostsResponse>(`${API_BASE_URL}/posts/feed`, { params: p });
  }

  getById(id: string): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${API_BASE_URL}/posts/${id}`);
  }

  getByUser(userId: string, params?: { page?: number; limit?: number }): Observable<PostsResponse> {
    let p = new HttpParams();
    if (params?.page) p = p.set('page', params.page);
    if (params?.limit) p = p.set('limit', params.limit);
    return this.http.get<PostsResponse>(`${API_BASE_URL}/users/${userId}/posts`, { params: p });
  }

  create(body: string, image?: File | null): Observable<PostResponse> {
    if (image) {
      const fd = new FormData();
      fd.append('body', body);
      fd.append('image', image);
      return this.http.post<PostResponse>(`${API_BASE_URL}/posts`, fd);
    }
    return this.http.post<PostResponse>(`${API_BASE_URL}/posts`, { body });
  }

  update(id: string, body: string, image?: File | null, removeImage = false): Observable<PostResponse> {
    if (image || removeImage) {
      const fd = new FormData();
      fd.append('body', body);
      if (image) fd.append('image', image);
      if (removeImage) fd.append('removeImage', 'true');
      return this.http.put<PostResponse>(`${API_BASE_URL}/posts/${id}`, fd);
    }
    return this.http.put<PostResponse>(`${API_BASE_URL}/posts/${id}`, { body });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${API_BASE_URL}/posts/${id}`);
  }

  like(id: string): Observable<any> {
    return this.http.put(`${API_BASE_URL}/posts/${id}/like`, {});
  }

  bookmark(id: string): Observable<{ success: boolean; data: { bookmarked: boolean; bookmarksCount?: number } }> {
    return this.http.put<{ success: boolean; data: { bookmarked: boolean; bookmarksCount?: number } }>(`${API_BASE_URL}/posts/${id}/bookmark`, {});
  }

  getSaved(params?: { page?: number; limit?: number }): Observable<any> {
    let p = new HttpParams();
    if (params?.page) p = p.set('page', params.page);
    if (params?.limit) p = p.set('limit', params.limit);
    return this.http.get<any>(`${API_BASE_URL}/users/bookmarks`, { params: p });
  }
}