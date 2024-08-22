import { Routes } from '@angular/router';

import { OnlineBankingComponent } from '../../components/dashboards/online-banking/online-banking.component';
import { WalletComponent } from '../../components/wallet/wallet/wallet.component';
import { WalletDetailsComponent } from '../../components/wallet/wallet-details/wallet-details.component';
import { loanRoutes } from '../../components/loan/loan.routes';
import { NyamuranziDetailsComponent } from '../../components/nyamuranzi/nyamuranzi-details/nyamuranzi-details.component';
import { TransferComponent } from '../../components/transfer/transfer/transfer.component';
import { TarifComponent } from '../../components/tarif/tarif.component';
import { WithdrawalComponent } from '../../components/withdrawal/withdrawal.component';
import { AccountComponent } from '../../components/account/account/account.component';
import { bankingSavingRoutes } from '../../components/saving/saving.routes';
import { AccountDetailsComponent } from '../../components/account/account-details/account-details.component';
import { WalletCreationComponent } from '../../components/wallet/wallet-creation/wallet-creation.component';

export const workstationBankingRoutes: Routes = [
  {
    path: '',
    component: OnlineBankingComponent,
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
    path: 'saving',
    children: bankingSavingRoutes,
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
    path: 'creat-wallet',
    component: WalletCreationComponent,
  },
];
