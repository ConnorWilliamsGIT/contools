import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'boids',
    loadComponent: () => import('./pages/boids/boids.component').then(m => m.BoidsComponent),
  },

];
