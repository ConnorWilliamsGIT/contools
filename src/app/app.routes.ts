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
  {
    path: 'pong',
    loadComponent: () => import('./pages/pong/pong.component').then(m => m.PongComponent),
    data: {
      pageName: 'Pong'
    }
  },
  {
    path: 'forge',
    loadComponent: () => import('./pages/forge/forge.component').then(m => m.ForgeComponent),
    data: {
      pageName: 'Forge'
    }
  },

];
