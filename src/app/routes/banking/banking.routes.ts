import { Routes } from '@angular/router';
import { bankingSavingRoutes } from '../../components/saving/saving.routes';
import { loanRoutes } from '../../components/loan/loan.routes';
import { NyamuranziDetailsComponent } from '../../components/nyamuranzi/nyamuranzi-details/nyamuranzi-details.component';

import { TransferComponent } from '../../components/transfer/transfer/transfer.component';

import { AccountComponent } from '../../components/account/account/account.component';

import { WalletComponent } from '../../components/wallet/wallet/wallet.component';
import { WalletDetailsComponent } from '../../components/wallet/wallet-details/wallet-details.component';
import { TarifComponent } from '../../components/tarif/tarif.component';
import { WithdrawalComponent } from '../../components/withdrawal/withdrawal.component';
import { AccountDetailsComponent } from '../../components/account/account-details/account-details.component';
import { MerchantListComponent } from '../../components/dev/agent/merchant-list/merchant-list.component';
import { AgentComponent } from '../../components/dev/agent/agent/agent.component';

export const bankingRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '../../components/dashboards/online-banking/online-banking.component'
      ).then(m => m.OnlineBankingComponent),
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
    children: loanRoutes,
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
    path: 'merchant',
    component: MerchantListComponent,
  },
];
