import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PostsService } from '../../services/posts.service';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { PostCardComponent } from '../../shared/post-card/post-card.component';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, PostCardComponent],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly posts = inject(PostsService);

  readonly user = signal<User | null>(null);
  readonly postsList = signal<Post[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.auth.profileData().subscribe({
      next: (res) => {
        this.user.set(res.data.user);
        this.loadPosts(res.data.user._id);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Failed to load profile');
      }
    });
  }

  loadPosts(userId: string): void {
    this.posts.getByUser(userId, { limit: 20 }).subscribe({
      next: (res) => {
        this.postsList.set(res.data.posts);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Failed to load posts');
      }
    });
  }

  onDeleted(id: string): void {
    this.postsList.set(this.postsList().filter(p => p._id !== id));
  }

  onUpdated(updated: Post): void {
    this.postsList.set(this.postsList().map(p => p._id === updated._id ? updated : p));
  }
}