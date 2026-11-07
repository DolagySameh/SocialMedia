import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

export interface AppNotification {
  _id: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  actor?: { _id: string; name: string; photo: string; username?: string };
  recipient?: { _id: string; name: string; photo: string };
  entityType?: string;
  entityId?: string;
  entity?: any;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notifications = signal<AppNotification[]>([]);
  readonly unreadCount = signal(0);
  readonly page = signal(1);
  readonly hasMore = signal(true);

  loadUnreadCount(): void {
    this.http.get<{ success: boolean; data: { unreadCount: number } }>(`${API_BASE_URL}/notifications/unread-count`).subscribe({
      next: (res) => this.unreadCount.set(res?.data?.unreadCount ?? 0),
      error: () => {}
    });
  }

  load(reset = false): void {
    if (reset) this.page.set(1);
    this.loading.set(true);
    this.error.set(null);
    let p = new HttpParams().set('page', this.page()).set('limit', 20);
    this.http.get<{ success: boolean; data: { notifications: AppNotification[] }; meta?: any }>(`${API_BASE_URL}/notifications`, { params: p }).subscribe({
      next: (res) => {
        const items = res.data.notifications ?? [];
        if (reset) this.notifications.set(items);
        else this.notifications.set([...this.notifications(), ...items]);
        const pag = res.meta?.pagination;
        this.hasMore.set(!!pag && (pag.nextPage ? true : (pag.currentPage ?? 1) < (pag.numberOfPages ?? 1)));
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Failed to load notifications');
      }
    });
  }

  markRead(id: string): Observable<any> {
    return this.http.patch(`${API_BASE_URL}/notifications/${id}/read`, {}).pipe(
      tap(() => {
        this.notifications.set(this.notifications().map(n => n._id === id ? { ...n, isRead: true } : n));
        this.unreadCount.set(Math.max(0, this.unreadCount() - 1));
      })
    );
  }

  markAllRead(): Observable<any> {
    return this.http.patch(`${API_BASE_URL}/notifications/read-all`, {}).pipe(
      tap(() => {
        this.notifications.set(this.notifications().map(n => ({ ...n, isRead: true })));
        this.unreadCount.set(0);
      })
    );
  }
}
