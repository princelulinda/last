import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { ApiService } from '..';
import {
  AddResponseModel,
  BodyModel,
} from '../../../components/settings/settings.models';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  accountsList,
  Accountdetail,
} from '../../../components/account/models';
import {
  creatWalletResponse,
  Walletdetail,
  WalletList,
  WalletTypModel,
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

  addAphoneNumber(body: BodyModel): Observable<AddResponseModel> {
    const url = '/extid/creation/';
    return this.apiService.post(url, body).pipe(
      map(response => {
        return response as AddResponseModel;
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

  getWalletType(): Observable<{ objects: WalletTypModel[] }> {
    const url = '/dbs/wallettype/list/';
    return this.apiService.get<{ objects: WalletTypModel[] }>(url);
  }

  creatWallet(
    wallet_type: string,
    title: string
  ): Observable<creatWalletResponse> {
    const url = '/dbs/wallet/create/';
    const body = {
      wallet_type: wallet_type,
      title: title,
    };
    return this.apiService.post(url, body).pipe(
      map(response => {
        return response as creatWalletResponse;
      })
    );
  }

  getClientAccountDetails(
    selectedAccount: string
  ): Observable<{ object: Accountdetail }> {
    const url = '/clients/manage/accounts/' + selectedAccount + '/';
    return this.apiService.get<{ object: Accountdetail }>(url);
  }
}
