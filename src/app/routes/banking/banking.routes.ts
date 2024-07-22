import { Routes } from '@angular/router';
import { OnlineBankingComponent } from '../../components/dashboards/online-banking/online-banking.component';
import { bankingSavingRoutes } from '../../components/saving/saving.routes';
import { loanRoutes } from '../../components/loan/loan.routes';
import { NyamuranziDetailsComponent } from '../../components/nyamuranzi/nyamuranzi-details/nyamuranzi-details.component';

import { TransferComponent } from '../../components/transfer/transfer/transfer.component';

import { AccountComponent } from '../../components/account/account/account.component';
import { DebitAccountComponent } from '../../components/transfer/debit-account/debit-account.component';

export const bankingRoutes: Routes = [
  {
    path: '',
    component: OnlineBankingComponent,
  },
  {
    path: 'saving',
    children: bankingSavingRoutes,
  },
  {
    path: 'loan',
    children: loanRoutes,
  },
  {
    path: 'nyamuranzi/details',
    component: NyamuranziDetailsComponent,
  },
  {
    path: 'transfer',
    component: TransferComponent,
  },

  {
    path: 'debitAccount',
    component: DebitAccountComponent,
  },
  {
    path: 'accounts',
    component: AccountComponent,
    children: [
      // { path: 'statement', component: GeneralStatementComponent },
    ],
  },
];
