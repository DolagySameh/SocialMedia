import { Component, inject, signal, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/post.model';
import { PostCardComponent } from '../../shared/post-card/post-card.component';

@Component({
  selector: 'app-saved-posts',
  imports: [PostCardComponent],
  templateUrl: './saved-posts.component.html'
})
export class SavedPostsComponent implements OnInit {
  private readonly posts = inject(PostsService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly postsList = signal<Post[]>([]);
  readonly page = signal(1);
  readonly hasMore = signal(true);

  ngOnInit(): void { this.load(true); }

  load(reset = false): void {
    if (reset) this.page.set(1);
    this.loading.set(true);
    this.error.set(null);
    this.posts.getSaved({ page: this.page(), limit: 10 }).subscribe({
      next: (res) => {
        const items = res?.data?.bookmarks ?? res?.data?.posts ?? [];
        if (reset) this.postsList.set(items);
        else this.postsList.set([...this.postsList(), ...items]);
        const pag = res.meta?.pagination;
        this.hasMore.set(!!pag && (pag.nextPage ? true : (pag.currentPage ?? 1) < (pag.numberOfPages ?? 1)));
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Failed to load saved posts');
      }
    });
  }

  loadMore(): void { this.page.set(this.page() + 1); this.load(false); }

  onDeleted(id: string): void {
    this.postsList.set(this.postsList().filter(p => p._id !== id));
  }

  onUpdated(updated: Post): void {
    if (updated.bookmarked === false) {
      this.postsList.set(this.postsList().filter(p => p._id !== updated._id));
    } else {
      this.postsList.set(this.postsList().map(p => p._id === updated._id ? updated : p));
    }
  }
}
