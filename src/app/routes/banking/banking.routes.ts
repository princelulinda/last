import { Routes } from '@angular/router';
import { OnlineBankingComponent } from '../../components/dashboards/online-banking/online-banking.component';
import { bankingSavingRoutes } from '../../components/saving/saving.routes';
import { loanRoutes } from '../../components/loan/loan.routes';
import { BeneficiariesComponent } from '../../components/transfer/beneficiaries/beneficiaries/beneficiaries.component';

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
    path: 'transfer',
    component: BeneficiariesComponent,
  },
];
