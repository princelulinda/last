import { CanActivateFn } from '@angular/router';

export const bankingGuard: CanActivateFn = () => {
  const isAuthorized = true;

  if (isAuthorized) {
    return true;
  } else {
    console.log('You have no access to this menu');
    return false;
  }
};
