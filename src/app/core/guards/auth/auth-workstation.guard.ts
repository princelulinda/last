// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';

// import { ConfigService, FullpathService } from '../../services';
// import { map } from 'rxjs';

// export const authWorkstationGuard: CanActivateFn = route => {
//   const configService = inject(ConfigService);
//   const router = inject(Router);
//   const fullPathService = inject(FullpathService);

//   return configService.operatorIsAuthenticated().pipe(
//     map(isAuthenticated => {
//       if (isAuthenticated) {
//         return true;
//       } else {
//         const currentUrl = fullPathService.getFullPath(route);
//         router.navigate(['/auth/corporate'], {
//           queryParams: { next: currentUrl },
//         });
//         return false;
//       }
//     })
//   );
// };

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { map, Observable } from 'rxjs';

import { FullpathService } from '../../services/config/fullpath.service';
import { ConfigService } from '../../services';

@Injectable({
  providedIn: 'root',
})
export class AuthWorkstationGuard {
  constructor(
    private fullpathService: FullpathService,
    private router: Router,
    private configService: ConfigService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.configService.operatorIsAuthenticated().pipe(
      map(state => {
        if (state) {
          return true;
        } else {
          const currentUrl = this.fullpathService.getFullPath(route);
          this.router.navigate(['/auth/corporate'], {
            queryParams: { next: currentUrl },
          });
          return false;
        }
      })
    );
  }
}
