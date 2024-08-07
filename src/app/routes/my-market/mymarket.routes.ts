import { Routes } from '@angular/router';
import { MyMarketDashboardComponent } from '../../components/dashboards/my-market-dashboard/my-market-dashboard.component';
import { MerchantConfigComponent } from '../../components/merchant/merchant-config/merchant-config.component';
import { ProductConfigComponent } from '../../components/products/product-config/product-config.component';
import { AddProductComponent } from '../../components/products/add-product/add-product.component';

export const myMarketRoutes: Routes = [
  { path: '', component: MyMarketDashboardComponent },
  { path: 'merchant-config', component: MerchantConfigComponent },
  { path: 'product-config', component: ProductConfigComponent },
  { path: 'add-product', component: AddProductComponent },
];
