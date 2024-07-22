import { Routes } from '@angular/router';

import { NoAuthGuard, AuthGuard } from './core/guards';
import { AuthRoutes } from './components/auth/auth.routes';
import { bankingRoutes } from './routes/banking/banking.routes';
import { newsFeedRoutes } from './routes/newsFeed/newsFeed.routes';
import { marketPlaceRoutes } from './routes/market-place/marketPlace.routes';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BankingComponent } from './layouts/banking/banking.component';
import { bankingSettingsRoutes } from './components/settings/settings.routes';
import { NotFound404Component } from './global/components/errors/not-found-404/not-found-404.component';
import { OnamobDashboardComponent } from './components/dashboards/onamob-dashboard/onamob-dashboard.component';
import { AuthCorporateLayoutComponent } from './layouts/auth-corporate-layout/auth-corporate-layout.component';
import { AuthCorporateComponent } from './components/auth/workstation/auth-corporate/auth-corporate.component';
import { myMarketRoutes } from './routes/my-market/mymarket.routes';
import { WorkstationComponent } from './layouts/workstation/workstation.component';
import { workstationRoutes } from './routes/workstation/workstation.routes';

export const routes: Routes = [
  // authentification routes
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [NoAuthGuard],
    children: AuthRoutes,
  },
  {
    path: 'auth/corporate',
    component: AuthCorporateLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: AuthCorporateComponent,
      },
    ],
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
      {
        path: 'onamob',
        component: OnamobDashboardComponent,
      },

      {
        path: 'mymarket',
        children: myMarketRoutes,
      },

      { path: '**', component: NotFound404Component },
    ],
  },

  {
    path: ':plateform',
    component: WorkstationComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'workstation',
        children: workstationRoutes,
      },
    ],
  },

  { path: '**', component: NotFound404Component },
];
