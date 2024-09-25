import { Routes } from '@angular/router';

import { DeskDashboardComponent } from '../../components/dev/desk-dashboard/desk-dashboard.component';
import { OperationListComponent } from '../../components/dev/operations/operation-list/operation-list.component';
import { CounterComponent } from '../../components/dev/operations/counter/counter.component';

export const DeskRoutes: Routes = [
  { path: '', component: DeskDashboardComponent },
  { path: 'operations/list', component: OperationListComponent },
  { path: 'operations/counters', component: CounterComponent },
];
