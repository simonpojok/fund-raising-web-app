import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Redirect root to dashboard if authenticated, otherwise to login
  {
    path: '',
    // canActivate: [authGuard],
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  // Auth routes
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },

  // Dashboard routes
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard]
  },

  // Fallback route for 404
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
