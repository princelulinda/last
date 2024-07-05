// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth/auth.service';

// export const noAuthGuard: CanActivateFn = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (authService.isAuthenticated()) {
//     console.log('NO : FOUND AUTHENTICATED');
//     // TODO : Put the first dashboard page
//     router.navigate(['/s/']);
//     return false;
//   }
//   console.log('NO : FOUND NOT AUTHENTICATED');

//   return true;
// };

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FullpathService } from '../../services/config/fullpath.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private fullpathService: FullpathService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (!this.authService.isAuthenticated()) {
      console.log('NO : GUARD FOUND NOT AUTHENTICATED');
      return true;
    } else {
      console.log(`NO : GUARD FOUND AUTHENTICATED ${this.router.url} ${state}`);

      this.router.navigate([this.fullpathService.nextDefaultUrl], {
        queryParams: { trackfrom: 'na_ext_gd' },
      });
      return false;
    }
  }
}
