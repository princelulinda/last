import { Routes } from '@angular/router';
// import { authGuard,workstationGuard, bankingGuard} from './core/guards';
import { AuthGuard, NoAuthGuard } from './core/guards';

import { routes as authRoutes } from './components/auth/auth.routes';
import { Notfound400Component } from './components/errors/notfound-400/notfound-400.component';
import { GeneralComponent } from './components/dev/general/general.component';

export const routes: Routes = [
  {
    path: 's',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: GeneralComponent,
      },
      {
        path: 'pu',
        component: GeneralComponent,
      },
      {
        path: 'fg/we',
        component: GeneralComponent,
      },
    ],
  },
  {
    path: '',
    canActivate: [NoAuthGuard],
    children: authRoutes,
  },
  // This is a temporary logic to abandon as soon as possible
  { path: 'dev-general', component: GeneralComponent },
  { path: '**', component: Notfound400Component },
];
