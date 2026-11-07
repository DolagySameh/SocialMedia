import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NotificationsService, AppNotification } from '../../services/notifications.service';

@Component({
  selector: 'app-notifications',
  imports: [RouterLink, DatePipe],
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  protected readonly ns = inject(NotificationsService);

  ngOnInit(): void {
    this.ns.load(true);
    this.ns.loadUnreadCount();
  }

  loadMore(): void {
    this.ns.page.set(this.ns.page() + 1);
    this.ns.load(false);
  }

  markRead(n: AppNotification): void {
    if (n.isRead) return;
    this.ns.markRead(n._id).subscribe();
  }

  markAll(): void {
    this.ns.markAllRead().subscribe();
  }

  label(n: AppNotification): string {
    switch (n.type) {
      case 'like_post': return 'liked your post';
      case 'comment_post': return 'commented on your post';
      case 'like_comment': return 'liked your comment';
      case 'reply_comment': return 'replied to your comment';
      case 'follow': return 'started following you';
      case 'share_post': return 'shared your post';
      case 'mention': return 'mentioned you';
      default: return 'interacted with you';
    }
  }

  entityLink(n: AppNotification): string | null {
    if (n.entityType === 'post' && n.entityId) return `/posts/${n.entityId}`;
    return null;
  }
}
