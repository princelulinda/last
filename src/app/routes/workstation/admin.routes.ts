import { Routes } from '@angular/router';
import { OperatorsComponent } from '../../components/admin/operator/operators/operators.component';
import { MenusComponent } from '../../components/admin/menu/menus/menus.component';
import { MenuDetailComponent } from '../../components/admin/menu/menu-detail/menu-detail.component';
import { RolesComponent } from '../../components/admin/role/roles/roles.component';
import { RoleDetailComponent } from '../../components/admin/role/role-detail/role-detail.component';
import { OperatorDetailsComponent } from '../../components/admin/operator/operator-details/operator-details.component';

export const AdminRoutes: Routes = [
  // Operator
  {
    path: 'operators',
    component: OperatorsComponent,
  },

  {
    path: 'operators/:id',
    component: OperatorDetailsComponent,
  },

  // Menu
  {
    path: 'menu',
    component: MenusComponent,
  },
  {
    path: 'menu/:id',
    component: MenuDetailComponent,
  },

  // Role
  {
    path: 'roles',
    component: RolesComponent,
  },
  {
    path: 'roles/:id',
    component: RoleDetailComponent,
  },
];
