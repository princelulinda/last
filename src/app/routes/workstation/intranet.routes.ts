import { Routes } from '@angular/router';

export const IntranetRoutes: Routes = [
  {
    path: 'access-required',
    loadComponent: () =>
      import(
        '../../global/components/errors/forbidden-403/forbidden-403.component'
      ).then(m => m.Forbidden403Component),
  },
];
