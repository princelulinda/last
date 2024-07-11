import { Routes } from '@angular/router';

import { NoAuthGuard, AuthGuard } from './core/guards';
import { AuthRoutes } from './components/auth/auth.routes';
import { bankingRoutes } from './routes/banking/banking.routes';
import { newsFeedRoutes } from './routes/newsFeed/newsFeed.routes';
import { marketPlaceRoutes } from './routes/market-place/marketPlace.routes';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BankingComponent } from './layouts/banking/banking.component';
import { bankingSettingsRoutes } from './components/settings/settings.routes';
import { NotFound404Component } from './components/errors/not-found-404/not-found-404.component';
// import { PopulateClientGuard } from './core/guards/populate-client/populate-client.guard';

export const routes: Routes = [
  // authentification routes
  {
    path: '',
    component: AuthLayoutComponent,
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
        path: 'newsfeed',
        children: newsFeedRoutes,
      },
      {
        path: 'banking',
        children: bankingRoutes,
      },
      {
        path: 'settings',
        children: bankingSettingsRoutes,
      },

      {
        path: 'market',
        children: marketPlaceRoutes,
      },
      { path: '**', component: NotFound404Component },
    ],
  },

  { path: '**', component: NotFound404Component },
];
