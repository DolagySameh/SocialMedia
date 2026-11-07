import { Component, inject, signal, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/post.model';
import { PostCardComponent } from '../../shared/post-card/post-card.component';

@Component({
  selector: 'app-my-posts',
  imports: [PostCardComponent],
  templateUrl: './my-posts.component.html'
})
export class MyPostsComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly posts = inject(PostsService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly postsList = signal<Post[]>([]);

  ngOnInit(): void {
    const u = this.auth.currentUser();
    if (!u) { this.loading.set(false); return; }
    this.posts.getByUser(u._id, { limit: 30 }).subscribe({
      next: (res) => { this.postsList.set(res.data.posts); this.loading.set(false); },
      error: (err) => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Failed to load'); }
    });
  }

  onDeleted(id: string): void { this.postsList.set(this.postsList().filter(p => p._id !== id)); }
  onUpdated(updated: Post): void { this.postsList.set(this.postsList().map(p => p._id === updated._id ? updated : p)); }
}
