import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { ApiService } from '..';
import {
  AddResponseModel,
  BodyModel,
} from '../../../components/settings/settings.models';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AccountsListModel,
  AccountDetailModel,
} from '../../../components/account/models';
import {
  CreatWalletResponse,
  WalletDetail,
  WalletList,
  WalletTopUpBodyModel,
  WalletTypModel,
} from '../../../components/wallet/wallet.models';
import {
  ClientInfoModel,
  SignatureModel,
} from '../../../global/components/lookups/lookup/lookup.model';
import {
  ClientCorporateModel,
  ClientLanguageWorkstationModel,
  ClientWorkstationModel,
  IndividualClientModel,
  LanguageWorkstationModel,
} from '../../../components/client/client.model';

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
  ): Observable<{ object: WalletDetail }> {
    const url = '/dbs/wallets/' + selectedWallet + '/';
    return this.apiService.get<{ object: WalletDetail }>(url);
  }

  getClientAccounts(
    clientId: number
  ): Observable<{ objects: AccountsListModel[] }> {
    const url = '/accounts/' + clientId + '/';
    return this.apiService.get<{ objects: AccountsListModel[] }>(url);
  }

  getWalletType(): Observable<{ objects: WalletTypModel[] }> {
    const url = '/dbs/wallettype/list/';
    return this.apiService.get<{ objects: WalletTypModel[] }>(url);
  }

  creatWallet(
    wallet_type: string,
    title: string,
    pin_code: number
  ): Observable<CreatWalletResponse> {
    const url = '/dbs/wallet/create/';
    const body = {
      wallet_type: wallet_type,
      title: title,
      pin_code,
    };
    return this.apiService.post(url, body).pipe(
      map(response => {
        return response as CreatWalletResponse;
      })
    );
  }

  getClientAccountDetails(
    selectedAccount: string
  ): Observable<{ object: AccountDetailModel }> {
    const url = '/clients/manage/accounts/' + selectedAccount + '/';
    return this.apiService.get<{ object: AccountDetailModel }>(url);
  }

  walletPopUp(body: WalletTopUpBodyModel): Observable<CreatWalletResponse> {
    const url = '/dbs/wallet/topup/';
    return this.apiService
      .post(url, body)
      .pipe(map(response => response as CreatWalletResponse));
  }

  getIndividualClientDetails(clientId: string): Observable<SignatureModel> {
    const apiUrl = '/clients/manage/individuals/' + clientId + '/';
    return this.apiService
      .get(apiUrl)
      .pipe(map(data => data as SignatureModel));
  }

  getCorporateClientDetails(clientId: string): Observable<SignatureModel> {
    const apiUrl = '/clients/manage/corporate/' + clientId + '/';
    return this.apiService
      .get(apiUrl)
      .pipe(map(data => data as SignatureModel));
  }
  client(bank_id: string): Observable<{ object: ClientInfoModel }> {
    return this.apiService
      .get('/account/details/?' + bank_id)
      .pipe(map(data => data as { object: ClientInfoModel }));
  }
  modifyClientLanguage(clientId = '', langCode: string, data: object) {
    return this.apiService
      .post(`/client/elements/update/${clientId}/?language=${langCode}`, data)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  getLanguages() {
    const apiUrl = '/languages/';
    return this.apiService
      .get<{ object: LanguageWorkstationModel }>(apiUrl)
      .pipe(map(data => data));
  }

  getClientLanguage(clientId: string) {
    const apiUrl = `/client/getelement/?client_id=${clientId}&element=language&phone_number=`;
    return this.apiService
      .get<{ object: ClientLanguageWorkstationModel }>(apiUrl)
      .pipe(map(data => data));
  }

  getClientDetails(clientId: string) {
    return this.apiService
      .get<{
        object: ClientWorkstationModel;
      }>('/clients/list/all/' + clientId + '/')
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  getClientIndividualDetails(clientId: string) {
    const apiUrl = '/clients/manage/individuals/' + clientId + '/';
    return this.apiService
      .get<{ object: IndividualClientModel }>(apiUrl)
      .pipe(map(data => data));
  }

  getClientCorporateDetails(clientId: string) {
    const apiUrl = '/clients/manage/corporate/' + clientId + '/';
    return this.apiService
      .get<{ object: ClientCorporateModel }>(apiUrl)
      .pipe(map(data => data));
  }

  UpdateIndividualClientDetails(clientId: string, data: object) {
    return this.apiService
      .patch(`/clients/manage/individuals/${clientId}/`, data)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  UpdateCorporateDetails(clientId: string, data: object) {
    return this.apiService
      .patch(`/clients/manage/corporate/${clientId}/`, data)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  modifyCategoryCorporate(
    clientId: string,
    categoryId: string,

    data: object
  ) {
    return this.apiService
      .post(
        `/client/elements/update/${clientId}/?client_category=${categoryId}`,
        data
      )
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  modifySectorCorporate(
    clientId: string,

    sectorId: string,
    data: object
  ) {
    return this.apiService
      .post(
        `/client/elements/update/${clientId}/?&activity_sector=${sectorId}`,
        data
      )
      .pipe(
        map(data => {
          return data;
        })
      );
  }
}
