import { Routes } from '@angular/router';

import { NoAuthGuard, AuthGuard } from './core/guards';
import { AuthRoutes } from './components/auth/auth.routes';
import { Notfound400Component } from './components/errors/notfound-400/notfound-400.component';
import { BankingComponent } from './components/layouts/banking/banking.component';
import { bankingRoutes } from './routes/banking/banking.routes';
import { newsFeedRoutes } from './routes/newsFeed/newsFeed.routes';
import { marketPlaceRoutes } from './routes/market-place/marketPlace.routes';

export const routes: Routes = [
  // authentification routes
  {
    path: '',
    canActivate: [NoAuthGuard],
    children: AuthRoutes,
  },

  // banking Routes

  {
    path: ':plateform',
    component: BankingComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'banking',
        children: bankingRoutes,
      },
      {
        path: 'newsFeed',
        children: newsFeedRoutes,
      },
      {
        path: 'market',
        children: marketPlaceRoutes,
      },
    ],
  },

  // // newsFeed Routes
  // {
  //   path: 'n',
  //   component: BankingComponent,
  //   canActivate: [AuthGuard],
  //   children: newsFeedRoutes,
  // },

  // // market place Routes
  // {
  //   path: 'm',
  //   component: BankingComponent,
  //   canActivate: [AuthGuard],
  //   children: marketPlaceRoutes,
  // },

  { path: '**', component: Notfound400Component },
];
