import { Routes } from '@angular/router';
// import { MarketDashboardComponent } from '../../components/dashboards/market-dashboard/market-dashboard.component';
import { MerchantConfigComponent } from '../../components/merchant/merchant-config/merchant-config.component';

export const marketPlaceRoutes: Routes = [
  { path: '', component: MerchantConfigComponent },
];
