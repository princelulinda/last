import { CanActivateFn } from '@angular/router';
import { DbService } from '../../db';
import { inject } from '@angular/core';

export const dbReadyGuard: CanActivateFn = () => {
  const DBService = inject(DbService);
  return DBService.dbIsReady;
};
