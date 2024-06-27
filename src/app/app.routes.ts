import { Routes } from '@angular/router';

import { NoAuthGuard, AuthGuard } from './core/guards';
import { AuthRoutes } from './components/auth/auth.routes';
import { Notfound400Component } from './components/errors/notfound-400/notfound-400.component';
import { BankingComponent } from './components/layouts/banking/banking.component';
import { bankingRoutes } from './routes/banking/banking.routes';
import { newsFeedRoutes } from './routes/newsFeed/newsFeed.routes';
import { marketPlaceRoutes } from './routes/market-place/marketPlace.routes';
//import { ClubAdhesionComponent } from './components/saving/club-adhesion/club-adhesion.component';
import { SavingClubDetailsComponent } from './components/saving/saving-club-details/saving-club-details.component';

export const routes: Routes = [
  // authentification routes
  {
    path: '',
    canActivate: [NoAuthGuard],
    children: AuthRoutes,
  },

  // banking Routes
  {
    path: 'b',
    component: SavingClubDetailsComponent,
    canActivate: [AuthGuard],
    children: bankingRoutes,
  },

  // newsFeed Routes
  {
    path: 'n',
    component: BankingComponent,
    canActivate: [AuthGuard],
    children: newsFeedRoutes,
  },

  // market place Routes
  {
    path: 'm',
    component: BankingComponent,
    canActivate: [AuthGuard],
    children: marketPlaceRoutes,
  },

  { path: '**', component: Notfound400Component },
];
