import { Routes } from '@angular/router';

import { MerchantConfigComponent } from '../../components/merchant/merchant-config/merchant-config.component';
import { WorkstationMarketDashboardComponent } from '../../components/dashboards/workstation-market-dashboard/workstation-market-dashboard.component';
import { ProductConfigComponent } from '../../components/merchant/products/product-config/product-config.component';
import { AddProductComponent } from '../../components/merchant/products/add-product/add-product.component';
import { PaymentReportsComponent } from '../../components/merchant/statements/payment-reports/payment-reports.component';
import { TransferReportsComponent } from '../../components/merchant/statements/transfer-reports/transfer-reports.component';

export const workstationMarketRoutes: Routes = [
  { path: '', component: WorkstationMarketDashboardComponent },
  { path: 'merchant-config', component: MerchantConfigComponent },
  { path: 'product-config', component: ProductConfigComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'payment-reports', component: PaymentReportsComponent },
  { path: 'transfer-reports', component: TransferReportsComponent },
];
