import { Routes } from '@angular/router';

import { MyMarketDashboardComponent } from '../../components/dashboards/my-market-dashboard/my-market-dashboard.component';
import { MerchantConfigComponent } from '../../components/merchant/merchant-config/merchant-config.component';

export const workstationMarketRoutes: Routes = [
  { path: '', component: MyMarketDashboardComponent },
  { path: 'merchant-config', component: MerchantConfigComponent },
];
