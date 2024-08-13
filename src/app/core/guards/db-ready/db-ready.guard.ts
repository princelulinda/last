import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DbService } from '../../db';

// export const dbReadyGuard: CanActivateFn = () => {
//   alert('Salut les cons');
//   const DBService = inject(DbService);
//   return DBService.dbIsReady;
// };

@Injectable({
  providedIn: 'root',
})
export class DBReadyGuard {
  constructor(private DBService: DbService) {}

  canActivate(): Observable<boolean> | boolean {
    return this.DBService.dbIsReady;
  }
}
