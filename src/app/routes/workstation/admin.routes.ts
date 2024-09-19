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

import { AdminDirectionListComponent } from '../../components/admin/rh/admin-direction-list/admin-direction-list.component';
import { AdminDirectionDetailsComponent } from '../../components/admin/rh/admin-direction-details/admin-direction-details.component';
import { AdminDepartementsDetailsComponent } from '../../components/admin/rh/admin-departements-details/admin-departements-details.component';
import { AdminDepartementsListComponent } from '../../components/admin/rh/admin-departements-list/admin-departements-list.component';
import { AdminServicesListComponent } from '../../components/admin/rh/admin-services-list/admin-services-list.component';
import { AdminServicesDetailsComponent } from '../../components/admin/rh/admin-services-details/admin-services-details.component';
import { ConfigTarifComponent } from '../../components/tarifs/config-tarif/config-tarif.component';
import { AdminAccessListComponent } from '../../components/admin/access/admin-access-list/admin-access-list.component';
export const AdminRoutes: Routes = [
  // Operator
  {
    path: 'operators',
    component: OperatorsComponent,
  },

  {
    path: 'operator/:id',
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
    path: 'role/:id',
    component: RoleDetailComponent,
  },
  {
    path: 'tellers',
    component: AdminTellersListComponent,
  },
  {
    path: 'teller/:tellerId',
    component: AdminTellersDetailsComponent,
  },
  {
    path: 'treasures',
    component: AdminTreasureListComponent,
  },
  {
    path: 'treasure/:treasureId',
    component: AdminTreasureDetailsComponent,
  },
  {
    path: 'counters',
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

  //directions
  { path: 'directions', component: AdminDirectionListComponent },
  { path: 'direction/:id', component: AdminDirectionDetailsComponent },

  //departments
  { path: 'departments', component: AdminDepartementsListComponent },
  { path: 'department/:id', component: AdminDepartementsDetailsComponent },

  //services
  { path: 'services', component: AdminServicesListComponent },
  { path: 'service/:id', component: AdminServicesDetailsComponent },
  { path: 'tarif', component: ConfigTarifComponent },

  {
    path: 'accesses',
    component: AdminAccessListComponent,
  },
];
