import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/post.model';
import { PostCardComponent } from '../../shared/post-card/post-card.component';

@Component({
  selector: 'app-home',
  imports: [FormsModule, PostCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private readonly posts = inject(PostsService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly postsList = signal<Post[]>([]);
  readonly page = signal(1);
  readonly hasMore = signal(true);

  newBody = '';
  creating = signal(false);

  ngOnInit(): void {
    this.load(true);
  }

  load(reset = false): void {
    if (reset) this.page.set(1);
    this.loading.set(true);
    this.error.set(null);
    this.posts.getAll({ page: this.page(), limit: 10 }).subscribe({
      next: (res) => {
        const items = res.data.posts;
        if (reset) this.postsList.set(items);
        else this.postsList.set([...this.postsList(), ...items]);
        const pag = res.meta?.pagination;
        this.hasMore.set(!!pag && (pag.nextPage ? true : (pag.currentPage ?? 1) < (pag.numberOfPages ?? 1)));
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Failed to load posts');
      }
    });
  }

  createPost(): void {
    const body = this.newBody.trim();
    if (!body) return;
    this.creating.set(true);
    this.posts.create(body).subscribe({
      next: (res) => {
        this.creating.set(false);
        this.newBody = '';
        this.postsList.set([res.data.post, ...this.postsList()]);
      },
      error: (err) => {
        this.creating.set(false);
        this.error.set(err?.error?.message ?? 'Create failed');
      }
    });
  }

  loadMore(): void {
    this.page.set(this.page() + 1);
    this.load(false);
  }

  onDeleted(id: string): void {
    this.postsList.set(this.postsList().filter(p => p._id !== id));
  }

  onUpdated(updated: Post): void {
    this.postsList.set(this.postsList().map(p => p._id === updated._id ? updated : p));
  }
}