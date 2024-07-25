import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WalletList } from '../../../components/wallet/wallet.models';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private selectedWalletSubject = new BehaviorSubject<WalletList | null>(null);
  selectedWallet$ = this.selectedWalletSubject.asObservable();

  private _isDetailsWalletShown: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  isDetailsWalletShown$ = this._isDetailsWalletShown.asObservable();

  private _hasWalletList: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  hasWalletList$ = this._hasWalletList.asObservable();

  selectWallet(wallet: WalletList) {
    this.selectedWalletSubject.next(wallet);
    this._isDetailsWalletShown.next(true);
  }

  clearSelectedWallet() {
    this.selectedWalletSubject.next(null);
    this._isDetailsWalletShown.next(false);
  }

  setWalletListState(hasList: boolean) {
    this._hasWalletList.next(hasList);
  }
}
