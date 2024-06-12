// import { inject } from '@angular/core';
// // import { CanActivateFn, Router ,ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth/auth.service';

// export const authGuard: CanActivateFn = () => {
//   // route: ActivatedRouteSnapshot,
//   // state: RouterStateSnapshot
//   console.log('ENTERING AUTH GUARD');
//   const authService = inject(AuthService);
//   const router = inject(Router);

// if (authService.isAuthenticated()) {
//   console.log('GUARD FOUND AUTHENTICATED');
//   return true;
// } else {
//   console.log('GUARD FOUND NOT AUTHENTICATED');

//   // TODO : Add 'next' param logics here
//   router.navigate(['/', { next: router.url }]);
//   return false;
// }
// return true;
// };

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { FullpathService } from '../services/config/fullpath.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private fullpathService: FullpathService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      console.log('GUARD FOUND AUTHENTICATED');
      return true;
    } else {
      console.log(`GUARD FOUND NOT AUTHENTICATED ${this.router.url} ${state}`);
      const currentUrl = this.fullpathService.getFullPath(route);

      // TODO : Add 'next' param logics here
      this.router.navigate(['/login/'], { queryParams: { next: currentUrl } });
      return false;
    }
  }
}
