import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'providers',
    canActivate: [authGuard],
    loadComponent: () => import('./components/providers/providers').then(m => m.ProvidersComponent)
  },
  {
    path: 'booking',
    canActivate: [authGuard, roleGuard(['PATIENT'])],
    loadComponent: () => import('./components/booking/booking').then(m => m.BookingComponent)
  },
  { path: '**', redirectTo: 'login' }
];