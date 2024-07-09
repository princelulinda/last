import { Routes } from '@angular/router';
import { bankingSavingRoutes } from '../../components/saving/saving.routes';
import { loanRoutes } from '../../components/loan/loan.routes';

export const bankingRoutes: Routes = [
  {
    path: 'saving',
    children: bankingSavingRoutes,
  },
  {
    path: '',
    children: loanRoutes,
  },
];
