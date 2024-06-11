import { inject } from '@angular/core';
// import { CanActivateFn, Router ,ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  // route: ActivatedRouteSnapshot,
  // state: RouterStateSnapshot
  console.log('ENTERING AUTH GUARD');
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    console.log('GUARD FOUND AUTHENTICATED');
    return true;
  } else {
    console.log('GUARD FOUND NOT AUTHENTICATED');

    // TODO : Add 'next' param logics here
    router.navigate(['/', { next: router.url }]);
    return false;
  }
  return true;
};
