import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';
import { Comment, CommentsResponse, CommentResponse } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private readonly http = inject(HttpClient);

  getComments(postId: string, params?: { page?: number; limit?: number }): Observable<CommentsResponse> {
    let p = new HttpParams();
    if (params?.page) p = p.set('page', params.page);
    if (params?.limit) p = p.set('limit', params.limit);
    return this.http.get<CommentsResponse>(`${API_BASE_URL}/posts/${postId}/comments`, { params: p });
  }

  create(postId: string, content: string): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(`${API_BASE_URL}/posts/${postId}/comments`, { content });
  }

  update(postId: string, commentId: string, content: string): Observable<CommentResponse> {
    return this.http.put<CommentResponse>(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, { content });
  }

  delete(postId: string, commentId: string): Observable<any> {
    return this.http.delete(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`);
  }
}