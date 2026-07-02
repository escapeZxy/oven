import { Routes } from '@angular/router';
import { LogListComponent } from './pages/log-list/log-list.component';

export const WORKOUT_LOG_ROUTES: Routes = [
  {
    path: '',
    component: LogListComponent,
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/plan-create/plan-create.component').then(m => m.PlanCreateComponent),
  },
  {
    path: 'session/:userPlanId',
    loadComponent: () =>
      import('./pages/workout-session/workout-session.component').then(
        m => m.WorkoutSessionComponent
      ),
  },
  {
    path: ':planId',
    loadComponent: () =>
      import('./pages/plan-detail/plan-detail').then(m => m.PlanDetail),
  },
];
