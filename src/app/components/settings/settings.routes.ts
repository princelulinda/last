import { Routes } from '@angular/router';

import { IndividualSettingsComponent } from './individual-settings/individual-settings.component';
import { GeneralSettingsComponent } from './general-settings/general-settings/general-settings.component';

export const bankingSettingsRoutes: Routes = [
  {
    path: '',
    component: GeneralSettingsComponent,
  },
  {
    path: 'security',
    component: IndividualSettingsComponent,
  },
];
