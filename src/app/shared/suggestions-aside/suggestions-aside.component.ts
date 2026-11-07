import { Component, inject, signal, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-suggestions-aside',
  imports: [],
  templateUrl: './suggestions-aside.component.html'
})
export class SuggestionsAsideComponent implements OnInit {
  private readonly users = inject(UsersService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly suggestions = signal<any[]>([]);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.users.getSuggestions({ limit: 5 }).subscribe({
      next: (res) => { this.suggestions.set(res.data.suggestions ?? []); this.loading.set(false); },
      error: (err) => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Failed to load suggestions'); }
    });
  }

  follow(s: any): void {
    this.users.follow(s._id).subscribe({
      next: (res) => {
        const following = res.data.following;
        this.suggestions.set(this.suggestions().map(x => x._id === s._id ? { ...x, following } : x));
        if (following) {
          this.suggestions.set(this.suggestions().filter(x => x._id !== s._id));
        }
      }
    });
  }
}
