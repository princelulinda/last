import { Routes } from '@angular/router';

import { WorkstationDashboardComponent } from '../../components/dashboards/workstation/workstation-dashboard/workstation-dashboard.component';
import { workstationBankingRoutes } from '../banking/workstation-banking.routes';
import { workstationMarketRoutes } from '../my-market/workstation-market.routes';
import { IntranetRoutes } from './intranet.routes';
import { DeskRoutes } from './desk.routes';
import { AdminRoutes } from './admin.routes';
import { ReportingRoutes } from './reporting.routes';
import { MetadataComponent } from '../../components/metadatas/metadata/metadata.component';
import { WorkstationMenuComponent } from '../../layouts/workstation/workstation-menu/workstation-menu.component';

export const workstationRoutes: Routes = [
  //Dashboards
  {
    path: '',
    component: WorkstationDashboardComponent,
  },
  {
    path: ':TypeMenu',
    component: WorkstationMenuComponent,
    children: [
      {
        path: 'banking',
        children: workstationBankingRoutes,
      },
      {
        path: 'market',
        children: workstationMarketRoutes,
      },
      {
        path: 'intranet',
        children: IntranetRoutes,
      },
      {
        path: 'desk',
        children: DeskRoutes,
      },
      {
        path: 'reporting',
        children: ReportingRoutes,
      },
      {
        path: 'admin',
        children: AdminRoutes,
      },
      {
        path: 'metadata',
        component: MetadataComponent,
      },
      {
        path: 'access-required',
        loadComponent: () =>
          import(
            '../../global/components/errors/forbidden-403/forbidden-403.component'
          ).then(m => m.Forbidden403Component),
      },
      {
        path: '**',
        loadComponent: () =>
          import(
            '../../global/components/errors/not-found-404/not-found-404.component'
          ).then(m => m.NotFound404Component),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import(
        '../../global/components/errors/not-found-404/not-found-404.component'
      ).then(m => m.NotFound404Component),
  },
];
