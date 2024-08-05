import { Routes } from '@angular/router';
import { OnlineBankingComponent } from '../../components/dashboards/online-banking/online-banking.component';
import { bankingSavingRoutes } from '../../components/saving/saving.routes';
import { loanRoutes } from '../../components/loan/loan.routes';
import { TransferComponent } from '../../components/transfer/transfer/transfer.component';
import { NyamuranziDetailsComponent } from '../../components/nyamuranzi/nyamuranzi-details/nyamuranzi-details.component';
import { AccountComponent } from '../../components/account/account/account.component';

import { WalletComponent } from '../../components/wallet/wallet/wallet.component';
import { WalletDetailsComponent } from '../../components/wallet/wallet-details/wallet-details.component';
import { TarifComponent } from '../../components/tarif/tarif.component';
import { BankHomeComponent } from '../../components/bank-home/bank-home.component';
import { WithdrawalComponent } from '../../components/withdrawal/withdrawal.component';
import { TestListComponent } from '../../components/dashboards/test-list/test-list.component';
export const bankingRoutes: Routes = [
  {
    path: '',
    component: OnlineBankingComponent,
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
    path: 'home',
    component: BankHomeComponent,
  },

  {
    path: 'accounts',
    component: AccountComponent,
    children: [
      // { path: 'statement', component: GeneralStatementComponent },
    ],
  },
  {
    path: 'test',
    component: TestListComponent,
  },
];
