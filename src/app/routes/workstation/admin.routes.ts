import { Routes } from '@angular/router';
import { OperatorsComponent } from '../../components/Operator/operators/operators.component';
import { MenusComponent } from '../../components/Operator/menus/menus.component';
import { RolesComponent } from '../../components/Operator/roles/roles.component';

export const AdminRoutes: Routes = [
  {
    path: 'operators',
    component: OperatorsComponent,
  },
  {
    path: 'menus',
    component: MenusComponent,
  },
  {
    path: 'roles',
    component: RolesComponent,
  },
];
