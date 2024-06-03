import { CanActivateFn } from '@angular/router';

export const workstationGuard: CanActivateFn = () => {
  const plateform = 'workStation';

  if (plateform !== 'workStation') {
    const confirmMessage =
      'This url will connect you in corporate. Are you sure you want to Login as corporate?';
    const confirmed = confirm(confirmMessage);

    if (!confirmed) {
      return false;
    }
  }

  return true;
};
