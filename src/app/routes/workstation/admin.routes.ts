import { Routes } from '@angular/router';
import { OperatorsComponent } from '../../components/admin/operator/operators/operators.component';
import { OperatorDesignTestComponent } from '../../components/admin/operator/operator-design-test/operator-design-test.component';
import { MenusComponent } from '../../components/admin/menu/menus/menus.component';
import { MenuDetailComponent } from '../../components/admin/menu/menu-detail/menu-detail.component';
import { RolesComponent } from '../../components/admin/role/roles/roles.component';
import { RoleDetailComponent } from '../../components/admin/role/role-detail/role-detail.component';
import { AdminTellersListComponent } from '../../components/admin/agence/admin-tellers-list/admin-tellers-list.component';

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
  {
    path: 'tellers',
    component: AdminTellersListComponent,
  },
];
