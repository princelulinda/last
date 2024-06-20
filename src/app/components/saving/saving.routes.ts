import { Routes } from '@angular/router';
import { SavingDashboardComponent } from './saving-dashboard/saving-dashboard.component';
import { SavingClubComponent } from './saving-club/saving-club.component';

export const bankingSavingRoutes: Routes = [
  {
    path: '',
    component: SavingDashboardComponent,
  },
  {
    path: 'saving-club',
    component: SavingClubComponent,
  },
];

export const workstationSavingRoutes: Routes = [];
