import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PostsService } from '../../services/posts.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './post-card.component.html'
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
  @Output() deleted = new EventEmitter<string>();
  @Output() updated = new EventEmitter<Post>();

  private readonly posts = inject(PostsService);
  protected readonly auth = inject(AuthService);

  readonly editing = signal(false);
  readonly saving = signal(false);
  readonly liking = signal(false);
  readonly bookmarking = signal(false);
  readonly error = signal<string | null>(null);
  editBody = '';

  get isOwner(): boolean {
    const u = this.auth.currentUser();
    const postUserId = typeof this.post.user === 'string' ? this.post.user : this.post.user?._id;
    return !!u && u._id === postUserId;
  }

  get postUser() {
    return typeof this.post.user === 'string' ? null : this.post.user;
  }

  get isLiked(): boolean {
    const u = this.auth.currentUser();
    return !!u && (this.post.likes ?? []).includes(u._id);
  }

  startEdit(): void {
    this.editBody = this.post.body;
    this.editing.set(true);
    this.error.set(null);
  }

  cancelEdit(): void {
    this.editing.set(false);
  }

  saveEdit(): void {
    this.saving.set(true);
    this.error.set(null);
    this.posts.update(this.post._id, this.editBody).subscribe({
      next: (res) => {
        this.saving.set(false);
        this.editing.set(false);
        this.updated.emit({ ...this.post, body: res.data.post.body, image: res.data.post.image ?? this.post.image });
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message ?? 'Update failed');
      }
    });
  }

  deletePost(): void {
    if (!confirm('Delete this post?')) return;
    this.posts.delete(this.post._id).subscribe({
      next: () => this.deleted.emit(this.post._id),
      error: (err) => this.error.set(err?.error?.message ?? 'Delete failed')
    });
  }

  toggleLike(): void {
    if (this.liking()) return;
    this.liking.set(true);
    this.posts.like(this.post._id).subscribe({
      next: (res) => {
        this.liking.set(false);
        const updated = res?.data?.post ?? this.post;
        this.updated.emit({ ...this.post, likes: updated.likes ?? this.post.likes, likesCount: updated.likesCount ?? this.post.likesCount });
      },
      error: (err) => {
        this.liking.set(false);
        this.error.set(err?.error?.message ?? 'Like failed');
      }
    });
  }

  toggleBookmark(): void {
    if (this.bookmarking()) return;
    this.bookmarking.set(true);
    this.posts.bookmark(this.post._id).subscribe({
      next: (res) => {
        this.bookmarking.set(false);
        this.updated.emit({ ...this.post, bookmarked: res.data.bookmarked, bookmarksCount: res.data.bookmarksCount ?? this.post.bookmarksCount });
      },
      error: (err) => {
        this.bookmarking.set(false);
        this.error.set(err?.error?.message ?? 'Bookmark failed');
      }
    });
  }
}
