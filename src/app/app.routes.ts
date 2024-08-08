import { Routes } from '@angular/router';

import { NoAuthGuard, AuthGuard, authWorkstationGuard } from './core/guards';
import { AuthRoutes } from './components/auth/auth.routes';
import { bankingRoutes } from './routes/banking/banking.routes';
import { newsFeedRoutes } from './routes/newsFeed/newsFeed.routes';
import { marketPlaceRoutes } from './routes/market-place/marketPlace.routes';
import { BankingComponent } from './layouts/banking/banking.component';
import { bankingSettingsRoutes } from './components/settings/settings.routes';
import { OnamobDashboardComponent } from './components/dashboards/onamob-dashboard/onamob-dashboard.component';
import { myMarketRoutes } from './routes/my-market/mymarket.routes';
import { workstationRoutes } from './routes/workstation/workstation.routes';

export const routes: Routes = [
  // authentification routes
  {
    path: '',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(
        m => m.AuthLayoutComponent
      ),
    canActivate: [NoAuthGuard],
    children: AuthRoutes,
  },

  {
    path: 'auth/corporate',
    loadComponent: () =>
      import(
        './layouts/auth-corporate-layout/auth-corporate-layout.component'
      ).then(m => m.AuthCorporateLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './components/auth/workstation/auth-corporate/auth-corporate.component'
          ).then(m => m.AuthCorporateComponent),
      },
    ],
  },

  {
    path: 'w',
    loadComponent: () =>
      import('./layouts/workstation/workstation.component').then(
        m => m.WorkstationComponent
      ),
    canActivate: [AuthGuard, authWorkstationGuard],
    children: [
      {
        path: 'workstation',
        children: workstationRoutes,
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

      {
        path: '**',
        loadComponent: () =>
          import(
            './global/components/errors/not-found-404/not-found-404.component'
          ).then(m => m.NotFound404Component),
      },
    ],
  },

  {
    path: '**',
    loadComponent: () =>
      import(
        './global/components/errors/not-found-404/not-found-404.component'
      ).then(m => m.NotFound404Component),
  },
];
