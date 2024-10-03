import { Routes } from '@angular/router';

import { DeskDashboardComponent } from '../../components/dev/desk-dashboard/desk-dashboard.component';
import { OperationListComponent } from '../../components/dev/operations/operation-list/operation-list.component';
import { CounterComponent } from '../../components/dev/operations/counter/counter.component';
//import { ClientAccountListComponent } from '../../components/client/client-account-list/client-account-list.component';
import { ClientAccountDetailComponent } from '../../components/client/client-account-detail/client-account-detail.component';
import { ClientDetailsComponent } from '../../components/client/client-details/client-details.component';
import { ClientListComponent } from '../../components/client/client-list/client-list.component';
import { CounterDetailsComponent } from '../../components/dev/operations/counter-details/counter-details.component';
import { DiverseOperationComponent } from '../../components/dev/diverse-operation/diverse-operation.component';

import { DebitAccountWorkstationComponent } from '../../components/transfer/workstation/debit-account-workstation/debit-account-workstation.component';

import { ClientWalletDetailsComponent } from '../../components/client/client-wallet-details/client-wallet-details.component';
import { AgentListComponent } from '../../components/admin/agent/agent-list/agent-list.component';
import { AgentDetailComponent } from '../../components/admin/agent/agent-detail/agent-detail.component';

export const DeskRoutes: Routes = [
  {
    path: 'client',
    children: [
      { path: 'list', component: ClientListComponent },

      {
        path: 'details/:client_id',
        component: ClientDetailsComponent,

        children: [
          {
            path: 'account/:accountId',
            component: ClientAccountDetailComponent,
          },
          {
            path: 'wallet/:walletId',
            component: ClientWalletDetailsComponent,
          },
        ],
      },
    ],
  },

  { path: '', component: DeskDashboardComponent },

  { path: 'operations/list', component: OperationListComponent },
  { path: 'operations/counters', component: CounterComponent },
  { path: 'operations/counter/:id', component: CounterDetailsComponent },

  { path: 'agent', component: AgentListComponent },
  { path: 'agent/details/:id', component: AgentDetailComponent },
  { path: 'diverse_operations', component: DiverseOperationComponent },
  { path: 'transfer', component: DebitAccountWorkstationComponent },

  {
    path: 'access-required',
    loadComponent: () =>
      import(
        '../../global/components/errors/forbidden-403/forbidden-403.component'
      ).then(m => m.Forbidden403Component),
  },
];
