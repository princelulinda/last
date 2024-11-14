import { Routes } from '@angular/router';
import { bankingSavingRoutes } from '../../components/saving/saving.routes';
import { BankingLoanRoutes } from '../../components/loan/loan.routes';
import { NyamuranziDetailsComponent } from '../../components/nyamuranzi/nyamuranzi-details/nyamuranzi-details.component';

import { TransferComponent } from '../../components/transfer/transfer/transfer.component';

import { AccountComponent } from '../../components/account/account/account.component';

import { WalletComponent } from '../../components/wallet/banking/wallet/wallet.component';
import { WalletDetailsComponent } from '../../components/wallet/banking/wallet-details/wallet-details.component';
import { TarifComponent } from '../../components/tarifs/tarif/tarif.component';
import { WithdrawalComponent } from '../../components/withdrawal/withdrawal.component';
import { AccountDetailsComponent } from '../../components/account/account-details/account-details.component';

import { AgentCreationComponent } from '../../components/dev/agent/agent-creation/agent-creation.component';
import { AgentComponent } from '../../components/dev/agent/agent/agent.component';
import { BankHomeComponent } from '../../components/dashboards/banking/online-banking/bank-home/bank-home.component';
import { MerchantListComponent } from '../../components/dev/agent/merchant-list/merchant-list.component';
import { AgentTransferComponent } from '../../components/dev/agent/agent-transfer/agent-transfer.component';

export const bankingRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '../../components/dashboards/banking/online-banking/online-banking.component'
      ).then(m => m.OnlineBankingComponent),
  },
  {
    path: 'home',
    component: BankHomeComponent,
  },
  {
    path: 'saving',
    children: bankingSavingRoutes,
  },

  {
    path: 'wallets',
    component: WalletComponent,
    children: [
      {
        path: 'details/:walletId',
        component: WalletDetailsComponent,
      },
    ],
  },
  {
    path: 'loan',
    children: BankingLoanRoutes,
  },
  {
    path: 'nyamuranzi/details',
    component: NyamuranziDetailsComponent,
  },
  {
    path: 'transfer',
    component: TransferComponent,
  },
  {
    path: 'tarifs',
    component: TarifComponent,
  },

  {
    path: 'withdrawal',
    component: WithdrawalComponent,
  },
  {
    path: 'accounts',
    component: AccountComponent,
    children: [
      {
        path: 'details/:accountId',
        component: AccountDetailsComponent,
      },
    ],
  },
  {
    path: 'agent',
    component: AgentComponent,
  },
  {
    path: 'agentcreation',
    component: AgentCreationComponent,
  },
  {
    path: 'agent',
    children: [
      {
        path: 'merchants',
        children: [
          {
            path: 'list',
            component: MerchantListComponent,
          },
        ],
      },
      {
        path: 'agent-transfer',
        component: AgentTransferComponent,
      },
    ],
  },
];
