import { Routes } from '@angular/router';
import { Directors } from './features/directors/directors';
import { Movies } from './features/movies/movies';

export const routes: Routes = [
  { path: '', redirectTo: '/directors', pathMatch: 'full' },
  { path: 'directors', component: Directors },
  { path: 'movies', component: Movies }
];