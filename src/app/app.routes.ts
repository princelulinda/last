import { Routes } from '@angular/router';

import { NoAuthGuard, AuthGuard } from './core/guards';
import { routes as authRoutes } from './components/auth/auth.routes';
import { Notfound400Component } from './components/errors/notfound-400/notfound-400.component';
import { BankingComponent } from './components/layouts/banking/banking.component';
import { bankingRoutes } from './components/online-banking/banking.routes';
import { newsFeedRoutes } from './components/news-feed/news-feed.routes';
import { marketPlaceRoutes } from './components/market-place/market-place.routes';

export const routes: Routes = [
  // authentification routes
  {
    path: '',
    canActivate: [NoAuthGuard],
    children: authRoutes,
  },
  // banking Routes
  {
    path: 'b',
    component: BankingComponent,
    canActivate: [AuthGuard],
    children: bankingRoutes,
  },

  // newsFeed Routes
  {
    path: 'n',
    component: BankingComponent,
    canActivate: [AuthGuard],
    children: newsFeedRoutes,
  },

  // market place Routes
  {
    path: 'm',
    component: BankingComponent,
    canActivate: [AuthGuard],
    children: marketPlaceRoutes,
  },

  { path: '**', component: Notfound400Component },
];
