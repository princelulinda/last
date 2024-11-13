import { Routes } from '@angular/router';

import { ClientAccountDetailComponent } from '../../components/client/client-account-detail/client-account-detail.component';
import { ClientDetailsComponent } from '../../components/client/client-details/client-details.component';
import { ClientListComponent } from '../../components/client/client-list/client-list.component';
import { ClientWalletDetailsComponent } from '../../components/client/client-wallet-details/client-wallet-details.component';
import { SignaturesComponent } from '../../components/client/signatures/signatures.component';
import { ClientCreditsComponent } from '../../components/client/client-credits/client-credits.component';
import { ClientCreditsLineComponent } from '../../components/client/client-credits-line/client-credits-line.component';

export const ClientRoutes: Routes = [
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
];
