import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ConfigService, FullpathService } from '../../services';

export const authWorkstationGuard: CanActivateFn = route => {
  const configService = inject(ConfigService);
  const router = inject(Router);
  const fullPathService = inject(FullpathService);

  if (configService.operatorIsAuthenticated()) {
    alert('Salut les gens');
    return true;
  } else {
    const currentUrl = fullPathService.getFullPath(route);
    router.navigate(['/auth/corporate'], { queryParams: { next: currentUrl } });
    alert('Salut les cons');
    return false;
  }
};
