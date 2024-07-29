import { Routes } from '@angular/router';

// import { MarketDashboardComponent } from '../../components/dashboards/market-dashboard/market-dashboard.component';
import { ProductsMarketPlaceRoutes } from '../../components/products/products.routes';
import { ProductConfigComponent } from '../../components/products/product-config/product-config.component';

export const marketPlaceRoutes: Routes = [
  { path: '', component: ProductConfigComponent },
  { path: 'products', children: ProductsMarketPlaceRoutes },
];
