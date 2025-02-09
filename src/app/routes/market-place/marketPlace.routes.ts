import { Routes } from '@angular/router';
import { MarketDashboardComponent } from '../../components/dashboards/banking/market-dashboard/market-dashboard.component';
import { myMarketRoutes } from '../my-market/mymarket.routes';
import { OrdersComponent } from '../../components/merchant/orders/orders.component';
import { CartsComponent } from '../../components/merchant/carts/carts.component';
import { MerchantsComponent } from '../../components/merchant/merchants/merchants.component';
import { ProductsMarketPlaceRoutes } from '../../components/merchant/products/products.routes';
import { MerchantTransferComponent } from '../../components/merchant/merchant-transfer/merchant-transfer.component';
import { BillDetailsComponent } from '../../components/merchant/bills/banking/bill-details/bill-details.component';
import { BillsComponent } from '../../components/merchant/bills/banking/bills/bills.component';

export const marketPlaceRoutes: Routes = [
  { path: '', component: MarketDashboardComponent },
  { path: 'products', children: ProductsMarketPlaceRoutes },
  { path: 'my-market', children: myMarketRoutes },
  { path: 'transfer', component: MerchantTransferComponent },
  { path: 'bills', component: BillsComponent },
  { path: 'bill/:id', component: BillDetailsComponent },
  { path: 'merchants', component: MerchantsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'carts', component: CartsComponent },
];
