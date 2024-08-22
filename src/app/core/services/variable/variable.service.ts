import { Injectable, signal, WritableSignal } from '@angular/core';

// import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VariableService {
  refreshFavoriteProducts: WritableSignal<boolean> = signal(false);
  refreshFavoriteMerchants: WritableSignal<boolean> = signal(false);
}
