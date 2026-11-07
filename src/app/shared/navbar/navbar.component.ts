import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  protected readonly auth = inject(AuthService);
  protected readonly notifications = inject(NotificationsService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) this.notifications.loadUnreadCount();
  }

  logout(): void {
    this.auth.logout();
  }
}
