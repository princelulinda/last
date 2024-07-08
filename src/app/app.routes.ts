import { Routes } from '@angular/router';

import { NoAuthGuard, AuthGuard } from './core/guards';
import { AuthRoutes } from './components/auth/auth.routes';
// import { Notfound400Component } from './components/errors/notfound-400/notfound-400.component';
import { bankingRoutes } from './routes/banking/banking.routes';
import { newsFeedRoutes } from './routes/newsFeed/newsFeed.routes';
import { marketPlaceRoutes } from './routes/market-place/marketPlace.routes';
//import { GeneralSettingsComponent } from './components/settings/general-settings/general-settings/general-settings.component';
import { NotFound404Component } from './components/errors/not-found-404/not-found-404.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BankingComponent } from './layouts/banking/banking.component';
import { bankingSettingsRoutes } from './components/settings/settings.routes';
// import { Forbidden403Component } from './components/dev/forbidden-403/forbidden-403.component';

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
