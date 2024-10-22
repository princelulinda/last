import { Injectable, signal, WritableSignal } from '@angular/core';

// import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VariableService {
  // TODO :: TO REMOVE
  // private topUpCompleteSource = new Subject<void>();
  // topUpComplete$ = this.topUpCompleteSource.asObservable();
  // announceTopUpComplete() {
  //   this.topUpCompleteSource.next();
  // }

  REFRESH_FAVORITE_PRODUCTS: WritableSignal<boolean> = signal(false);
  REFRESH_FAVORITE_MERCHANTS: WritableSignal<boolean> = signal(false);

  MENU_ACCESS_KEY: WritableSignal<string> = signal('');

  REFRESH_WALLET_LIST: WritableSignal<boolean> = signal(false);
  REFRESH_ACCOUNT_LIST: WritableSignal<boolean> = signal(false);
}
