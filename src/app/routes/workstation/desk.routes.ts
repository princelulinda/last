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

import { ClientWalletDetailsComponent } from '../../components/client/client-wallet-details/client-wallet-details.component';
import { AgentListComponent } from '../../components/admin/agent/agent-list/agent-list.component';
import { AgentDetailComponent } from '../../components/admin/agent/agent-detail/agent-detail.component';

import { MerchantListComponent } from '../../components/merchant/workstation/merchant-list/merchant-list.component';
import { MerchantDetailsComponent } from '../../components/merchant/workstation/merchant-details/merchant-details.component';
import { BalanceComponent } from '../../components/dev/operations/balance/balance.component';
import { ShortcutsComponent } from '../../components/admin/customer-base/shortcuts/shortcuts.component';
import { SignaturesComponent } from '../../components/client/signatures/signatures.component';
import { ClientCreditsComponent } from '../../components/client/client-credits/client-credits.component';
import { ClientCreditsLineComponent } from '../../components/client/client-credits-line/client-credits-line.component';

export const DeskRoutes: Routes = [
  { path: '', component: DeskDashboardComponent },

  // NOTE :: CLIENT MODULE
  {
    path: 'client',
    children: [
      { path: 'list', component: ClientListComponent },

      {
        path: 'detail/:client_id',
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
          {
            path: 'credit/:creditId',
            component: ClientCreditsComponent,
          },
          {
            path: 'creditLine/:creditLineId',
            component: ClientCreditsLineComponent,
          },
          {
            path: 'settings',
            component: SignaturesComponent,
          },
        ],
      },
    ],
  },

  // NOTE :: OPERATIONS MODULES
  {
    path: 'operations',
    children: [
      { path: 'list', component: OperationListComponent },
      { path: 'counters', component: CounterComponent },
      { path: 'counter/:id', component: CounterDetailsComponent },
    ],
  },

  // NOTE :: MERCHANT MODULE
  {
    path: 'agent',
    children: [
      { path: '', component: AgentListComponent },

      { path: 'detail/:id', component: AgentDetailComponent },
    ],
  },

  { path: 'diverse_operations', component: DiverseOperationComponent },

  {
    path: 'balances',
    component: BalanceComponent,
  },

  // NOTE :: MERCHANT MODULE
  {
    path: 'merchant',
    children: [
      { path: '', component: MerchantListComponent },
      { path: 'detail/:id', component: MerchantDetailsComponent },
    ],
  },

  // NOTE :: SHORTCUTS MODULE
  { path: 'shortcuts', component: ShortcutsComponent },

  {
    path: 'access-required',
    loadComponent: () =>
      import(
        '../../global/components/errors/forbidden-403/forbidden-403.component'
      ).then(m => m.Forbidden403Component),
  },
];
