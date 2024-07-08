import { Routes } from '@angular/router';
import { OnlineBankingComponent } from '../../components/dashboards/online-banking/online-banking.component';

export const bankingRoutes: Routes = [
  {
    path: '',
    component: OnlineBankingComponent,
  },
];
