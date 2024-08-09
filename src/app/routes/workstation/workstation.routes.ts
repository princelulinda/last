import { Routes } from '@angular/router';

import { WorkstationDashboardComponent } from '../../components/dashboards/workstation-dashboard/workstation-dashboard.component';
import { workstationBankingRoutes } from '../banking/workstation-banking.routes';
import { workstationMarketRoutes } from '../my-market/workstation-market.routes';
import { IntranetRoutes } from './intranet.routes';
import { DeskRoutes } from './desk.routes';
import { AdminRoutes } from './admin.routes';
import { ReportingRoutes } from './reporting.routes';
import { BankingLayoutComponent } from '../../layouts/workstation/banking-layout/banking-layout.component';
import { MarketLayoutComponent } from '../../layouts/workstation/market-layout/market-layout.component';
import { IntranetLayoutComponent } from '../../layouts/workstation/intranet-layout/intranet-layout.component';
import { DeskLayoutComponent } from '../../layouts/workstation/desk-layout/desk-layout.component';

export const workstationRoutes: Routes = [
  //Dashboards
  {
    path: '',
    component: WorkstationDashboardComponent,
  },
  {
    path: 'banking',
    component: BankingLayoutComponent,
    children: workstationBankingRoutes,
  },
  {
    path: 'market',
    component: MarketLayoutComponent,
    children: workstationMarketRoutes,
  },
  {
    path: 'intranet',
    component: IntranetLayoutComponent,
    children: IntranetRoutes,
  },
  {
    path: 'desk',
    component: DeskLayoutComponent,
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
