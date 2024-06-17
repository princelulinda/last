import { Routes } from '@angular/router';
// import { authGuard,workstationGuard, bankingGuard} from './core/guards';

import { AuthLayoutComponent } from './components/auth/auth-layout/auth-layout.component';
import { Notfound400Component } from './components/errors/notfound-400/notfound-400.component';
import { GeneralComponent } from './components/dev/general/general.component';
import { HeaderComponent } from './components/dev/header/header.component';

export const routes: Routes = [
  {
    path: '',
    component: HeaderComponent, // this is the component with the <router-outlet> in the template
    children: [
      {
        path: 'password-creation', // child route path
        component: AuthLayoutComponent, // child route component that the router renders
      },
    ],
  },
  // This is a temporary logic to abandon as soon as possible
  { path: 'dev-general', component: GeneralComponent },
  { path: '**', component: Notfound400Component },
];
