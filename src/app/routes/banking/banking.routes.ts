import { Routes } from '@angular/router';
//import { bankingSavingRoutes } from '../../components/saving/saving.routes';
//import { GeneralSettingsComponent } from '../../components/settings/general-settings/general-settings/general-settings.component';
import { IndividualSettingsComponent } from '../../components/settings/individual-settings/individual-settings.component';

export const bankingRoutes: Routes = [
  // {
  //   path: 'saving',
  //   children: bankingSavingRoutes,
  // },

  { path: '', component: IndividualSettingsComponent },
];
