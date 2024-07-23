import { Routes } from '@angular/router';

import { WorkstationDashboardComponent } from '../../components/dashboards/workstation-dashboard/workstation-dashboard.component';

export const workstationRoutes: Routes = [
  {
    path: '',
    component: WorkstationDashboardComponent,
  },
];
