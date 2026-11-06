import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PostsService } from '../../services/posts.service';
import { CommentsService } from '../../services/comments.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';
import { PostCardComponent } from '../../shared/post-card/post-card.component';

@Component({
  selector: 'app-post-details',
  imports: [RouterLink, FormsModule, PostCardComponent, DatePipe],
  templateUrl: './post-details.component.html'
})
export class PostDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly posts = inject(PostsService);
  private readonly comments = inject(CommentsService);
  protected readonly auth = inject(AuthService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly post = signal<Post | null>(null);
  readonly commentsList = signal<Comment[]>([]);
  readonly commentsLoading = signal(false);

  newComment = '';
  creatingComment = signal(false);
  editingCommentId = signal<string | null>(null);
  editCommentBody = '';
  commentError = signal<string | null>(null);

  get postId(): string {
    return this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadPost();
    this.loadComments();
  }

  loadPost(): void {
    this.posts.getById(this.postId).subscribe({
      next: (res) => {
        this.post.set(res.data.post);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Failed to load post');
      }
    });
  }

  loadComments(): void {
    this.commentsLoading.set(true);
    this.comments.getComments(this.postId, { limit: 50 }).subscribe({
      next: (res) => {
        this.commentsList.set(res.data.comments);
        this.commentsLoading.set(false);
      },
      error: () => this.commentsLoading.set(false)
    });
  }

  createComment(): void {
    const content = this.newComment.trim();
    if (!content) return;
    this.creatingComment.set(true);
    this.commentError.set(null);
    this.comments.create(this.postId, content).subscribe({
      next: (res) => {
        this.creatingComment.set(false);
        this.newComment = '';
        const p = this.post();
        if (p) this.post.set({ ...p, commentsCount: (p.commentsCount ?? 0) + 1 });
        this.loadComments();
      },
      error: (err) => {
        this.creatingComment.set(false);
        this.commentError.set(err?.error?.message ?? 'Failed to comment');
      }
    });
  }

  startEdit(c: Comment): void {
    this.editingCommentId.set(c._id);
    this.editCommentBody = c.content;
  }

  cancelEdit(): void {
    this.editingCommentId.set(null);
  }

  saveEdit(c: Comment): void {
    this.comments.update(this.postId, c._id, this.editCommentBody).subscribe({
      next: (res) => {
        this.editingCommentId.set(null);
        this.loadComments();
      },
      error: (err) => this.commentError.set(err?.error?.message ?? 'Update failed')
    });
  }

  deleteComment(c: Comment): void {
    if (!confirm('Delete comment?')) return;
    this.comments.delete(this.postId, c._id).subscribe({
      next: () => {
        const p = this.post();
        if (p) this.post.set({ ...p, commentsCount: Math.max(0, (p.commentsCount ?? 1) - 1) });
        this.loadComments();
      },
      error: (err) => this.commentError.set(err?.error?.message ?? 'Delete failed')
    });
  }

  isCommentOwner(c: Comment): boolean {
    const u = this.auth.currentUser();
    return !!u && u._id === c.commentCreator._id;
  }

  onPostUpdated(updated: Post): void {
    this.post.set(updated);
  }

  onPostDeleted(): void {
    this.router.navigate(['/']);
  }
}