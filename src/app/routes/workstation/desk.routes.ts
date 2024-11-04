import { Routes } from '@angular/router';

import { OperationListComponent } from '../../components/operations/operation-list/operation-list.component';
import { CounterComponent } from '../../components/operations/counter/counter.component';

import { ClientAccountDetailComponent } from '../../components/client/client-account-detail/client-account-detail.component';
import { ClientDetailsComponent } from '../../components/client/client-details/client-details.component';
import { ClientListComponent } from '../../components/client/client-list/client-list.component';
import { CounterDetailsComponent } from '../../components/operations/counter-details/counter-details.component';
import { DiverseOperationComponent } from '../../components/dev/diverse-operation/diverse-operation.component';

import { ClientWalletDetailsComponent } from '../../components/client/client-wallet-details/client-wallet-details.component';
import { AgentListComponent } from '../../components/agent/workstation/agent-list/agent-list.component';
import { AgentDetailComponent } from '../../components/agent/workstation/agent-detail/agent-detail.component';

import { MerchantListComponent } from '../../components/merchant/workstation/merchant-list/merchant-list.component';
import { MerchantDetailsComponent } from '../../components/merchant/workstation/merchant-details/merchant-details.component';
import { BalanceComponent } from '../../components/operations/balance/balance.component';
import { ShortcutsComponent } from '../../components/admin/customer-base/shortcuts/shortcuts.component';
import { SignaturesComponent } from '../../components/client/signatures/signatures.component';
import { ClientCreditsComponent } from '../../components/client/client-credits/client-credits.component';
import { ClientCreditsLineComponent } from '../../components/client/client-credits-line/client-credits-line.component';

import { MENU_KEYS } from '../../global/utils/menu/all-menus.config';
import { GetMenuKeyGuard } from '../../core/guards/menu-key/get-menu-key.guard';
import { DeskDashboardComponent } from '../../components/dashboards/workstation/desk-dashboard/desk-dashboard.component';
import { BalanceSheetComponent } from '../../components/dev/accounting/balance-sheet/balance-sheet.component';
import { OperationResultComponent } from '../../components/dev/accounting/operation-result/operation-result.component';
import { CreditLineListComponent } from '../../components/loan/workstation /credit-line/credit-line-list/credit-line-list.component';
import { WalletListWsComponent } from '../../components/wallet/wallet-list-ws/wallet-list-ws.component';
import { CreditLineDetailsComponent } from '../../components/loan/workstation /credit-line/credit-line-details/credit-line-details.component';
import { CreditListComponent } from '../../components/dev/credit/credit-list/credit-list.component';
import { CreditRequestListComponent } from '../../components/dev/credit/credit-request-list/credit-request-list.component';
import { CreditRequestComponent } from '../../components/dev/credit/credit-request/credit-request.component';
import { CreditDetailsComponent } from '../../components/dev/credit/credit-details/credit-details.component';
//import { DebitAccountWorkstationComponent } from '../../components/transfer/workstation/debit-account-workstation/debit-account-workstation.component';

export const DeskRoutes: Routes = [
  { path: '', component: DeskDashboardComponent },

  // NOTE :: CLIENT MODULE
  { path: 'wallets', component: WalletListWsComponent },

  {
    path: 'client',
    children: [
      {
        path: 'list',
        component: ClientListComponent,
      },

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
    canActivate: [GetMenuKeyGuard],
    data: {
      signature: MENU_KEYS.CLIENT,
    },
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

  // NOTE :: BALANCE SHEET
  {
    path: 'balance-sheet',
    component: BalanceSheetComponent,
  },

  // NOTE :: OPERATION RESULT
  {
    path: 'operation-result',
    component: OperationResultComponent,
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
  {
    path: 'credit',
    children: [
      {
        path: 'creditsline',
        children: [
          {
            path: 'list',
            component: CreditLineListComponent,
          },
        ],
      },
      {
        path: 'line',
        children: [
          {
            path: 'details/:id',
            component: CreditLineDetailsComponent,
          },
        ],
      },
      {
        path: 'details/:id',
        component: CreditDetailsComponent,
      },
      {
        path: '',
        component: CreditListComponent,
      },
      {
        path: 'request',
        component: CreditRequestComponent,
      },
      {
        path: 'requests',
        component: CreditRequestListComponent,
      },
    ],
  },
];
