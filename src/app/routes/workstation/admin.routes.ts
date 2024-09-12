import { Routes } from '@angular/router';
import { OperatorsComponent } from '../../components/admin/operator/operators/operators.component';
import { MenusComponent } from '../../components/admin/menu/menus/menus.component';
import { MenuDetailComponent } from '../../components/admin/menu/menu-detail/menu-detail.component';
import { RolesComponent } from '../../components/admin/role/roles/roles.component';
import { RoleDetailComponent } from '../../components/admin/role/role-detail/role-detail.component';
import { OperatorDetailsComponent } from '../../components/admin/operator/operator-details/operator-details.component';
import { AdminTellersListComponent } from '../../components/admin/agence/admin-tellers-list/admin-tellers-list.component';
import { AdminTellersDetailsComponent } from '../../components/admin/agence/admin-tellers-details/admin-tellers-details.component';
import { AdminTreasureListComponent } from '../../components/admin/agence/admin-treasure-list/admin-treasure-list.component';
import { AdminTreasureDetailsComponent } from '../../components/admin/agence/admin-treasure-details/admin-treasure-details.component';
import { AdminCounterListComponent } from '../../components/admin/agence/admin-counter-list/admin-counter-list.component';
import { AdminCounterDetailsComponent } from '../../components/admin/agence/admin-counter-details/admin-counter-details.component';
import { AdminBranchListComponent } from '../../components/admin/agence/admin-branch-list/admin-branch-list.component';
import { AdminBranchDetailsComponent } from '../../components/admin/agence/admin-branch-details/admin-branch-details.component';
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
  {
    path: 'tellers',
    component: AdminTellersListComponent,
  },
  {
    path: 'tellers/:tellerId',

    component: AdminTellersDetailsComponent,
  },
  {
    path: 'treasure',
    component: AdminTreasureListComponent,
  },
  {
    path: 'treasure/:treasureId',

    component: AdminTreasureDetailsComponent,
  },
  {
    path: 'counter',

    component: AdminCounterListComponent,
  },
  {
    path: 'counter/:counterId',

    component: AdminCounterDetailsComponent,
  },

  {
    path: 'branch',

    component: AdminBranchListComponent,
  },

  {
    path: 'branch/:branchId',
    component: AdminBranchDetailsComponent,
  },
];
