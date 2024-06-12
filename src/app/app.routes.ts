import { Routes } from '@angular/router';
// import { authGuard,workstationGuard, bankingGuard} from './core/guards';
// import { authGuard, noAuthGuard } from './core/guards';

//import { routes as authRoutes } from './components/auth/auth.routes';
import { Notfound400Component } from './components/errors/notfound-400/notfound-400.component';
import { GeneralComponent } from './components/dev/general/general.component';
import { BankingComponent } from './components/layouts/banking/banking.component';
import { bankingRoutes } from './components/online-banking/banking.routes';
import { newsFeedRoutes } from './components/news-feed/news-feed.routes';
import { marketPlaceRoutes } from './components/market-place/market-place.routes';

export const routes: Routes = [
  {
    path: 's',
    // canActivate: [authGuard],
    children: [
      {
        path: '',
        component: GeneralComponent,
      },
    ],
  },
  //   {
  //     path: '',
  //     // canActivate: [noAuthGuard],
  //     children: authRoutes,
  //   },
  // This is a temporary logic to abandon as soon as possible
  { path: 'dev-general', component: GeneralComponent },

  // banking Routes
  {
    path: 'b',
    component: BankingComponent,
    children: bankingRoutes,
  },

  // newsFeed Routes
  {
    path: 'n',
    component: BankingComponent,
    children: newsFeedRoutes,
  },

  // market place Routes
  {
    path: 'm',
    component: BankingComponent,
    children: marketPlaceRoutes,
  },

  { path: '**', component: Notfound400Component },
];
