import { Routes } from '@angular/router';
import { AdminDirectionListComponent } from '../../components/admin/rh/admin-direction-list/admin-direction-list.component';
import { AdminDirectionDetailsComponent } from '../../components/admin/rh/admin-direction-details/admin-direction-details.component';
import { AdminDepartementsDetailsComponent } from '../../components/admin/rh/admin-departements-details/admin-departements-details.component';
import { AdminDepartementsListComponent } from '../../components/admin/rh/admin-departements-list/admin-departements-list.component';
import { AdminServicesListComponent } from '../../components/admin/rh/admin-services-list/admin-services-list.component';
import { AdminServicesDetailsComponent } from '../../components/admin/rh/admin-services-details/admin-services-details.component';
import { ConfigTarifComponent } from '../../components/config-tarif/config-tarif.component';
import { DeskDashboardComponent } from '../../components/dev/desk-dashboard/desk-dashboard.component';

export const DeskRoutes: Routes = [
  { path: '', component: DeskDashboardComponent },
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
];
