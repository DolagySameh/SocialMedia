import { Component, inject, signal, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/post.model';
import { PostCardComponent } from '../../shared/post-card/post-card.component';

@Component({
  selector: 'app-community',
  imports: [PostCardComponent],
  templateUrl: './community.component.html'
})
export class CommunityComponent implements OnInit {
  private readonly posts = inject(PostsService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly postsList = signal<Post[]>([]);

  ngOnInit(): void {
    this.posts.getFeed({ only: 'following', limit: 20 }).subscribe({
      next: (res) => { this.postsList.set(res.data.posts); this.loading.set(false); },
      error: (err) => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Failed to load community feed'); }
    });
  }

  onDeleted(id: string): void { this.postsList.set(this.postsList().filter(p => p._id !== id)); }
  onUpdated(updated: Post): void { this.postsList.set(this.postsList().map(p => p._id === updated._id ? updated : p)); }
}
