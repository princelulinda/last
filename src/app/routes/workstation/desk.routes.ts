import { Routes } from '@angular/router';
import { AdminDirectionListComponent } from '../../components/rh/admin-direction-list/admin-direction-list.component';
import { AdminDirectionDetailsComponent } from '../../components/rh/admin-direction-details/admin-direction-details.component';
import { AdminDepartementsDetailsComponent } from '../../components/rh/admin-departements-details/admin-departements-details.component';
import { AdminDepartementsListComponent } from '../../components/rh/admin-departements-list/admin-departements-list.component';
import { AdminServicesListComponent } from '../../components/rh/admin-services-list/admin-services-list.component';
import { AdminServicesDetailsComponent } from '../../components/rh/admin-services-details/admin-services-details.component';
import { ConfigutarionTarifComponent } from '../../components/configutarion-tarif/configutarion-tarif.component';

export const DeskRoutes: Routes = [
  //directions
  { path: 'directions', component: AdminDirectionListComponent },
  { path: 'direction/:id', component: AdminDirectionDetailsComponent },

  //departments
  { path: 'departments', component: AdminDepartementsListComponent },
  { path: 'department/:id', component: AdminDepartementsDetailsComponent },

  //services
  { path: 'services', component: AdminServicesListComponent },
  { path: 'service/:id', component: AdminServicesDetailsComponent },
  {path:'tarif', component:ConfigutarionTarifComponent}
];
