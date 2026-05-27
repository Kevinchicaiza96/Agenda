import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/task-list/task-list').then(m => m.TaskListComponent)
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./features/calendar/calendar-view/calendar-view').then(m => m.CalendarViewComponent)
      },
      {
        path: 'notes',
        loadComponent: () =>
          import('./features/notes/notes-list/notes-list').then(m => m.NotesListComponent)
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];