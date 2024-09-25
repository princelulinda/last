import { Routes } from '@angular/router';

import { DeskDashboardComponent } from '../../components/dev/desk-dashboard/desk-dashboard.component';
import { OperationListComponent } from '../../components/dev/operations/operation-list/operation-list.component';

export const DeskRoutes: Routes = [
  { path: '', component: DeskDashboardComponent },
  { path: 'operations/list', component: OperationListComponent },
];
