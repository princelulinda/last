import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { ApiService } from '..';
import {
  AddResponse,
  BodyModel,
} from '../../../components/settings/settings.models';
import { BehaviorSubject, Observable } from 'rxjs';
import { accountsList } from '../../../components/account/models';
import {
  Walletdetail,
  WalletList,
} from '../../../components/wallet/wallet.models';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private apiService: ApiService) {
    //
  }

  private selectedWalletSubject = new BehaviorSubject<WalletList | null>(null);
  selectedWallet$ = this.selectedWalletSubject.asObservable();

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
  ): Observable<{ object: Walletdetail }> {
    const url = '/dbs/wallets/' + selectedWallet + '/';
    return this.apiService.get<{ object: Walletdetail }>(url);
  }

  getClientAccounts(clientId: number): Observable<{ objects: accountsList[] }> {
    const url = '/accounts/' + clientId + '/';
    return this.apiService.get<{ objects: accountsList[] }>(url);
  }
}
