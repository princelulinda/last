import { Routes } from '@angular/router';
// import { authGuard,workstationGuard, bankingGuard} from './core/guards';
import { LeftAsideMenuComponent } from './shared/aside-menu/left-aside-menu/left-aside-menu.component';

export const routes: Routes = [
  {
    path: '',
    component: LeftAsideMenuComponent,
  },
];
