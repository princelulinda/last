import { Routes } from '@angular/router';
import { OperatorsComponent } from '../../components/Operator/operators/operators.component';
import { MenusComponent } from '../../components/Operator/menus/menus.component';
import { RolesComponent } from '../../components/Operator/roles/roles.component';
import { MenuDetailComponent } from '../../components/Operator/menu-detail/menu-detail.component';
import { RoleDetailComponent } from '../../components/Operator/role-detail/role-detail.component';
import { OperatorDesignTestComponent } from '../../components/Operator/operator-design-test/operator-design-test.component';

export const AdminRoutes: Routes = [
  // Operator
  {
    path: 'operators',
    component: OperatorsComponent,
  },

  // design
  {
    path: 'operators/:id',
    component: OperatorDesignTestComponent,
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
