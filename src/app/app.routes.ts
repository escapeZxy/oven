import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'workout-log', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'workout-log',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/workout-log/workout-log.routes').then(
        m => m.WORKOUT_LOG_ROUTES
      )
  },
  { path: '**', redirectTo: 'workout-log' },
];
