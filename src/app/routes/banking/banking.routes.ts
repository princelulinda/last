import { Routes } from '@angular/router';
import { bankingSavingRoutes } from '../../components/saving/saving.routes';
import { LoanHomeComponent } from '../../components/loan/loan-home/loan-home.component';

export const bankingRoutes: Routes = [
  {
    path: 'saving',
    children: bankingSavingRoutes,
  },
  {
    path: '',
    component: LoanHomeComponent,
  },
];
