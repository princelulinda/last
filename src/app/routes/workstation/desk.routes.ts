import { Routes } from '@angular/router';

import { DeskDashboardComponent } from '../../components/dev/desk-dashboard/desk-dashboard.component';
import { OperationListComponent } from '../../components/dev/operations/operation-list/operation-list.component';
import { CounterComponent } from '../../components/dev/operations/counter/counter.component';
import { CounterDetailsComponent } from '../../components/dev/operations/counter-details/counter-details.component';

export const DeskRoutes: Routes = [
  { path: '', component: DeskDashboardComponent },
  { path: 'operations/list', component: OperationListComponent },
  { path: 'operations/counters', component: CounterComponent },
  { path: 'operations/counter/:id', component: CounterDetailsComponent },
];
