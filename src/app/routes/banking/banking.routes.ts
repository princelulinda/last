import { Routes } from '@angular/router';
import { dashboardHomeRoutes } from '../../components/dashboard/dashboard.routes';

export const bankingRoutes: Routes = [
  {
    path: 'dashboard',
    children: dashboardHomeRoutes,
  },
];
