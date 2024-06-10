import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    console.log('NO : FOUND AUTHENTICATED');
    // TODO : Put the first dashboard page
    router.navigate(['/s/']);
    return false;
  }
  console.log('NO : FOUND NOT AUTHENTICATED');

  return true;
};
