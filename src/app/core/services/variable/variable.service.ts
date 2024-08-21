import { Injectable, signal, WritableSignal } from '@angular/core';

// import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VariableService {
  // public isFavorite = new Subject<boolean>();
  // isFavorite$ = this.isFavorite.asObservable();

  refreshFavoriteProducts: WritableSignal<boolean> = signal(false);
  refreshFavoriteMerchants: WritableSignal<boolean> = signal(false);
}
