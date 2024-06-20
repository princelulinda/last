import { Routes } from '@angular/router';

import { SavingDashboardComponent } from '../../components/saving/saving-dashboard/saving-dashboard.component';

import { SavingClubComponent } from '../../components/saving/saving-club/saving-club.component';

export const bankingRoutes: Routes = [
  {
    path: 'saving',
    component: SavingDashboardComponent,
  },
  {
    path: 'saving-club',
    component: SavingClubComponent,
  },
];
