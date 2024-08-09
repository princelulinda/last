import { Routes } from '@angular/router';
import { LoanHomeComponent } from './loan-home/loan-home.component';
import { LoanSimulatorComponent } from './loan-simulator/loan-simulator.component';
import { LoanRequestComponent } from './loan-request/loan-request.component';
import { LoanListComponent } from './loan-list/loan-list.component';
import { LoanPendingComponent } from './loan-pending/loan-pending.component';
import { LoanPendingDetailsComponent } from './loan-pending-details/loan-pending-details.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';

export const loanRoutes: Routes = [
  {
    path: '',
    component: LoanHomeComponent,
  },
  {
    path: 'simulator',
    component: LoanSimulatorComponent,
  },
  {
    path: 'request',
    component: LoanRequestComponent,
  },
  {
    path: 'list',
    component: LoanListComponent,
    children: [
      {
        path: ':id',
        component: LoanDetailsComponent,
      },
    ],
  },
  {
    path: 'pending',
    component: LoanPendingComponent,
    children: [
      {
        path: ':id',
        component: LoanPendingDetailsComponent,
      },
    ],
  },
];
