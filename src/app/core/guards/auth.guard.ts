import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    console.log('FOUND AUTHENTICATED');
    return true;
  } else {
    console.log('FOUND NOT AUTHENTICATED');

    // TODO : Add 'next' param logics here
    router.navigate(['/', { next: router.url }]);
    return false;
  }
  return true;
};
