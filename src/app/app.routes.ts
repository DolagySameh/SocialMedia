import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { PostDetailsComponent } from './pages/post-details/post-details.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { SavedPostsComponent } from './pages/saved-posts/saved-posts.component';
import { MyPostsComponent } from './pages/my-posts/my-posts.component';
import { CommunityComponent } from './pages/community/community.component';
import { authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'community', component: CommunityComponent, canActivate: [authGuard] },
  { path: 'my-posts', component: MyPostsComponent, canActivate: [authGuard] },
  { path: 'saved', component: SavedPostsComponent, canActivate: [authGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [authGuard] },
  { path: 'posts/:id', component: PostDetailsComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
