import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'graphs',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    data: {
      pageName: 'Graphs'
    }
  },
  {
    path: '',
    redirectTo: '/graphs',
    pathMatch: 'full'
  },
  {
    path: 'boids',
    loadComponent: () => import('./pages/boids/boids.component').then(m => m.BoidsComponent),
    data: {
      pageName: 'Boids'
    }
  },

];
