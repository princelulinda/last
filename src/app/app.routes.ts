import { Routes } from '@angular/router';
// import { authGuard,workstationGuard, bankingGuard} from './core/guards';
// import { authGuard, noAuthGuard } from './core/guards';

import { AuthLayoutComponent } from './components/auth/auth-layout/auth-layout.component';
import { Notfound400Component } from './components/errors/notfound-400/notfound-400.component';
import { GeneralComponent } from './components/dev/general/general.component';

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
  {
    path: '',
    // canActivate: [noAuthGuard],
    children: [
      {
        path: '',
        component: AuthLayoutComponent,
      },
    ],
  },
  // This is a temporary logic to abandon as soon as possible
  { path: 'dev-general', component: GeneralComponent },
  { path: '**', component: Notfound400Component },
];
