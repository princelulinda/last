import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import {
  ConfigService,
  //  FullpathService
} from '../../services';

export const authWorkstationGuard: CanActivateFn = () => {
  const configService = inject(ConfigService);
  const router = inject(Router);
  // const fullPathService = inject(FullpathService);

  const operatorAuthenticated = configService.getLocalConnectedOperator();
  if (operatorAuthenticated) {
    return true;
  } else {
    // const currentUrl = fullPathService.getFullPath(route);
    router.navigate(['/auth/corporate']);
    // {
    //   queryParams: { next: currentUrl },
    // }
    return false;
  }
};
