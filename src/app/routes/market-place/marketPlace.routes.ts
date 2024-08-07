import { Routes } from '@angular/router';

import { MarketDashboardComponent } from '../../components/dashboards/market-dashboard/market-dashboard.component';
import { ProductsMarketPlaceRoutes } from '../../components/products/products.routes';
import { MerchantTransferComponent } from '../../components/products/merchant-transfer/merchant-transfer.component';
import { BillsComponent } from '../../components/products/bills/bills.component';
import { BillDetailsComponent } from '../../components/products/bill-details/bill-details.component';
import { MerchantComponent } from '../../components/merchant/merchant/merchant.component';
import { MerchantConfigComponent } from '../../components/merchant/merchant-config/merchant-config.component';
import { myMarketRoutes } from '../my-market/mymarket.routes';
import { OrdersComponent } from '../../components/dev/orders/orders.component';
import { CartsComponent } from '../../components/dev/carts/carts.component';
import { ProductConfigComponent } from '../../components/products/product-config/product-config.component';

export const marketPlaceRoutes: Routes = [
  { path: '', component: MarketDashboardComponent },
  { path: 'products', children: ProductsMarketPlaceRoutes },
  { path: 'my-market', children: myMarketRoutes },
  { path: 'transfer', component: MerchantTransferComponent },
  { path: 'bills', component: BillsComponent },
  { path: 'bill/:id', component: BillDetailsComponent },
  { path: 'merchants', component: MerchantComponent },
  { path: 'merchant-config', component: MerchantConfigComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'carts', component: CartsComponent },
  { path: 'product-config', component: ProductConfigComponent },
];
