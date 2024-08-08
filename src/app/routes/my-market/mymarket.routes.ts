import { Routes } from '@angular/router';
import { MyMarketDashboardComponent } from '../../components/dashboards/my-market-dashboard/my-market-dashboard.component';
import { MerchantConfigComponent } from '../../components/merchant/merchant-config/merchant-config.component';
import { ProductConfigComponent } from '../../components/products/product-config/product-config.component';
import { AddProductComponent } from '../../components/products/add-product/add-product.component';
import { PaymentReportsComponent } from '../../components/my-market/payment-reports/payment-reports.component';
import { BillsReportsComponent } from '../../components/my-market/bills-reports/bills-reports.component';

export const myMarketRoutes: Routes = [
  { path: '', component: MyMarketDashboardComponent },
  { path: 'merchant-config', component: MerchantConfigComponent },
  { path: 'product-config', component: ProductConfigComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'payment-reports', component: PaymentReportsComponent },
  { path: 'bill-reports', component: BillsReportsComponent },
];
