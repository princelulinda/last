import { CanActivateFn } from '@angular/router';

export const treasurerGuard: CanActivateFn = () => {
  const isTreasurer = true;

  if (!isTreasurer) {
    console.log("You're not a treasurer.");
    return false;
  }

  return true;
};
