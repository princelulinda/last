import { Routes } from '@angular/router';
import { bankingSavingRoutes } from '../../components/saving/saving.routes';

export const bankingRoutes: Routes = [
  {
    path: 'saving',
    children: bankingSavingRoutes,
  },
];
