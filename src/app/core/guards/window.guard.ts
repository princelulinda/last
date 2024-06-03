import { CanDeactivateFn } from '@angular/router';

export const windowGuard: CanDeactivateFn<unknown> = () => {
  const isWorkstation = true;

  if (!isWorkstation) {
    const confirmMessage =
      'This url will connect you in corporate. Are you sure you want to Login as corporate?';
    return confirm(confirmMessage);
  }

  return true;
};
