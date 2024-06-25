import { Routes } from '@angular/router';
import { bankingSavingRoutes } from '../../components/saving/saving.routes';
import { dashboardHomeRoutes } from '../../components/dashboard/dashboard.routes';

export const bankingRoutes: Routes = [
  {
    path: 'saving',
    children: bankingSavingRoutes,
  },
  {
    path: 'dashboard',
    children: dashboardHomeRoutes,
  },
];
