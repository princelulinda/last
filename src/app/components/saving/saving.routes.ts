import { Routes } from '@angular/router';
import { SavingDashboardComponent } from './saving-dashboard/saving-dashboard.component';
import { SavingClubComponent } from './saving-club/saving-club.component';
import { ClubAdhesionComponent } from './club-adhesion/club-adhesion.component';
export const bankingSavingRoutes: Routes = [
  {
    path: '',
    component: SavingDashboardComponent,
  },
  {
    path: 'saving-club',
    component: SavingClubComponent,
  },
  {
    path: 'adhesion/:tontineId',
    component: ClubAdhesionComponent,
  },
];

export const workstationSavingRoutes: Routes = [];
