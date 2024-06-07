import { CanDeactivateFn } from '@angular/router';

export const windowGuard: CanDeactivateFn<unknown> = (
  component: unknown,
  ...args
) => {
  const isWorkstation = true;

  // TODO : Make expected checks here. This is just a place holder
  if (!isWorkstation && component && args) {
    const confirmMessage =
      'This url will connect you in corporate. Are you sure you want to Login as corporate?';
    return confirm(confirmMessage);
  }

  return true;
};

// currentRoute: ActivatedRouteSnapshot,
//   currentState: RouterStateSnapshot,
//   nextState: RouterStateSnapshot
