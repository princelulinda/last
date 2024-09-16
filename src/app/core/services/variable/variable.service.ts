import { Injectable, signal, WritableSignal } from '@angular/core';

import { Subject } from 'rxjs';
// import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VariableService {
  private topUpCompleteSource = new Subject<void>();
  topUpComplete$ = this.topUpCompleteSource.asObservable();

  refreshFavoriteProducts: WritableSignal<boolean> = signal(false);
  refreshFavoriteMerchants: WritableSignal<boolean> = signal(false);

  announceTopUpComplete() {
    this.topUpCompleteSource.next();
  }
}
