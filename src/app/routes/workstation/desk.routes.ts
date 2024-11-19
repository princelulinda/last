import { Routes } from '@angular/router';

import { OperationListComponent } from '../../components/operations/operation-list/operation-list.component';
import { CounterComponent } from '../../components/operations/counter/counter.component';

import { CounterDetailsComponent } from '../../components/operations/counter-details/counter-details.component';
import { DiverseOperationComponent } from '../../components/dev/diverse-operation/diverse-operation.component';

import { AgentListComponent } from '../../components/agent/workstation/agent-list/agent-list.component';
import { AgentDetailComponent } from '../../components/agent/workstation/agent-detail/agent-detail.component';

import { MerchantListComponent } from '../../components/merchant/workstation/merchant-list/merchant-list.component';
import { MerchantDetailsComponent } from '../../components/merchant/workstation/merchant-details/merchant-details.component';
import { BalanceComponent } from '../../components/operations/balance/balance.component';
import { ShortcutsComponent } from '../../components/admin/customer-base/shortcuts/shortcuts.component';

// import { MENU_KEYS } from '../../global/utils/menu/all-menus.config';
import { GetMenuKeyGuard } from '../../core/guards/menu-key/get-menu-key.guard';
import { DeskDashboardComponent } from '../../components/dashboards/workstation/desk-dashboard/desk-dashboard.component';

import { WalletListWsComponent } from '../../components/wallet/workstation/wallet-list-ws/wallet-list-ws.component';
import { WorkstationCreditRoutes } from '../../components/loan/loan.routes';
import { ClientRoutes } from '../../components/client/client.routes';
import { DebitAccountWorkstationComponent } from '../../components/transfer/workstation/debit-account-workstation/debit-account-workstation.component';

export const DeskRoutes: Routes = [
  { path: '', component: DeskDashboardComponent },

  // NOTE :: CLIENT MODULE
  { path: 'wallets', component: WalletListWsComponent },

  {
    path: 'client',
    children: ClientRoutes,
    canActivate: [GetMenuKeyGuard],
    // data: {
    //   signature: MENU_KEYS.CLIENTS,
    // },
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
  // { path: 'transfer-ws', component: DebitAccountWorkstationComponent },

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
  { path: 'debit', component: DebitAccountWorkstationComponent },

  {
    path: 'access-required',
    loadComponent: () =>
      import(
        '../../global/components/errors/forbidden-403/forbidden-403.component'
      ).then(m => m.Forbidden403Component),
  },

  // NOTE :: WORKSTATION CREDIT
  {
    path: 'credit',
    children: WorkstationCreditRoutes,
  },
];
