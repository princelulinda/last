// import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  // const authService = inject(AuthService);
  // const router = inject(Router);

  // if (authService.isAuthenticated()) {
  //   return true;
  // } else {
  //   router.navigate(['/']);
  //   return false;
  // }
  return true;
};
