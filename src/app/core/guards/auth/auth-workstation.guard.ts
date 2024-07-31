import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ConfigService, FullpathService } from '../../services';
import { map } from 'rxjs';

export const authWorkstationGuard: CanActivateFn = route => {
  const configService = inject(ConfigService);
  const router = inject(Router);
  const fullPathService = inject(FullpathService);

  return configService.operatorIsAuthenticated().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        const currentUrl = fullPathService.getFullPath(route);
        router.navigate(['/auth/corporate'], {
          queryParams: { next: currentUrl },
        });
        return false;
      }
    })
  );
};
