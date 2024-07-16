import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { ApiService } from '..';
import {
  AddResponse,
  BodyModel,
} from '../../../components/settings/setting.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { WalletList } from '../../../components/wallet/models';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private apiService: ApiService) {
    //
  }
  private _hasWalletList: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  get hasWalletList$(): Observable<boolean> {
    return this._hasWalletList.asObservable();
  }

  isWalletList(arg: boolean) {
    this._hasWalletList.next(arg);
  }
  private _isDetailsWalletShown: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  get isDetailsWalletShown$(): Observable<boolean> {
    return this._isDetailsWalletShown.asObservable();
  }
  addAphoneNumber(body: BodyModel): Observable<AddResponse> {
    const url = '/extid/creation/';
    return this.apiService.post(url, body).pipe(
      map(response => {
        return response as AddResponse;
      })
    );
  }

  getWallets(clientId: number): Observable<{ objects: WalletList[] }> {
    const url = `/dbs/wallets/?client_id=${clientId}`;
    return this.apiService.get<{ objects: WalletList[] }>(url);
  }

  getWalletDetails(
    selectedWallet: string
  ): Observable<{ object: WalletList[] }> {
    const url = '/dbs/wallets/' + selectedWallet + '/';
    return this.apiService.get<{ object: WalletList[] }>(url);
  }
}
