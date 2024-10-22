import { Injectable, signal, WritableSignal } from '@angular/core';

import { Subject } from 'rxjs';
// import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VariableService {
  // TODO :: TO REMOVE
  private topUpCompleteSource = new Subject<void>();
  topUpComplete$ = this.topUpCompleteSource.asObservable();
  announceTopUpComplete() {
    this.topUpCompleteSource.next();
  }

  refreshFavoriteProducts: WritableSignal<boolean> = signal(false);
  refreshFavoriteMerchants: WritableSignal<boolean> = signal(false);

  MENU_ACCESS_KEY: WritableSignal<string> = signal('');

  refreshWallets: WritableSignal<boolean> = signal(false);
  refreshAllAccounts: WritableSignal<boolean> = signal(false);
}
