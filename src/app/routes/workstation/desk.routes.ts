import { Routes } from '@angular/router';

import { DeskDashboardComponent } from '../../components/dev/desk-dashboard/desk-dashboard.component';
import { OperationListComponent } from '../../components/dev/operations/operation-list/operation-list.component';
import { CounterComponent } from '../../components/dev/operations/counter/counter.component';
//import { ClientAccountListComponent } from '../../components/client/client-account-list/client-account-list.component';
import { ClientAccountDetailComponent } from '../../components/client/client-account-detail/client-account-detail.component';
import { ClientDetailsComponent } from '../../components/client/client-details/client-details.component';
import { ClientListComponent } from '../../components/client/client-list/client-list.component';
export const DeskRoutes: Routes = [
  { path: 'list', component: ClientListComponent },

  {
    path: 'details/:client_id',
    component: ClientDetailsComponent,

    children: [
      {
        path: 'account/:accountId',
        component: ClientAccountDetailComponent,
      },
    ],
  },

  { path: '', component: DeskDashboardComponent },
  { path: 'operations/list', component: OperationListComponent },
  { path: 'operations/counters', component: CounterComponent },
];
