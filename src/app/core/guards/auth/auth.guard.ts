import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';
import { FullpathService } from '../../services/config/fullpath.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
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
