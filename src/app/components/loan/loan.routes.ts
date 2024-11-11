import { Routes } from '@angular/router';
import { LoanHomeComponent } from './loan-home/loan-home.component';
import { LoanSimulatorComponent } from './loan-simulator/loan-simulator.component';
import { LoanRequestComponent } from './loan-request/loan-request.component';
import { LoanListComponent } from './loan-list/loan-list.component';
import { LoanPendingComponent } from './loan-pending/loan-pending.component';
import { LoanPendingDetailsComponent } from './loan-pending-details/loan-pending-details.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';

import { CreditLineListComponent } from '../../components/loan/workstation /credit-line/credit-line-list/credit-line-list.component';

import { CreditLineDetailsComponent } from '../../components/loan/workstation /credit-line/credit-line-details/credit-line-details.component';
import { CreditDetailsComponent } from '../../components/loan/workstation /credit/credit-details/credit-details.component';
import { CreditListComponent } from '../../components/loan/workstation /credit/credit-list/credit-list.component';
import { CreditRequestListComponent } from '../../components/loan/workstation /credit/credit-request-list/credit-request-list.component';

export const BankingLoanRoutes: Routes = [
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

export const WorkstationCreditRoutes: Routes = [
  {
    path: 'list',
    component: CreditListComponent,
  },
  {
    path: 'details/:id',
    component: CreditDetailsComponent,
  },
  {
    path: 'creditsline',
    children: [
      {
        path: 'list',
        component: CreditLineListComponent,
      },
      {
        path: 'details/:id',
        component: CreditLineDetailsComponent,
      },
    ],
  },

  {
    path: 'request',
    children: [
      {
        path: 'list',
        component: CreditRequestListComponent,
      },
    ],
  },
];
