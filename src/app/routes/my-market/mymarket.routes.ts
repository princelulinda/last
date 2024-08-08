import { Routes } from '@angular/router';
import { MyMarketDashboardComponent } from '../../components/dashboards/my-market-dashboard/my-market-dashboard.component';
import { PaymentReportsComponent } from '../../components/my-market/payment-reports/payment-reports.component';
import { BillsReportsComponent } from '../../components/my-market/bills-reports/bills-reports.component';

export const myMarketRoutes: Routes = [
  { path: '', component: MyMarketDashboardComponent },
  { path: 'payment-reports', component: PaymentReportsComponent },
  { path: 'bill-reports', component: BillsReportsComponent },
];
