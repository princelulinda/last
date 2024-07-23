import { Routes } from '@angular/router';

import { WorkstationDashboardComponent } from '../../components/dashboards/workstation-dashboard/workstation-dashboard.component';
import { workstationBankingRoutes } from '../banking/workstation-banking.routes';
import { workstationMarketRoutes } from '../my-market/workstation-market.routes';
import { IntranetRoutes } from './intranet.routes';
import { DeskRoutes } from './desk.routes';
import { AdminRoutes } from './admin.routes';
import { ReportingRoutes } from './reporting.routes';

export const workstationRoutes: Routes = [
  {
    path: '',
    component: WorkstationDashboardComponent,
  },
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
];
