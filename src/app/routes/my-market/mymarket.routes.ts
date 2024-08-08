import { Routes } from '@angular/router';
import { MyMarketDashboardComponent } from '../../components/dashboards/my-market-dashboard/my-market-dashboard.component';
import { MerchantRegisterComponent } from '../../components/dev/merchant-register/merchant-register.component';

export const myMarketRoutes: Routes = [
  { path: '', component: MyMarketDashboardComponent },
];
