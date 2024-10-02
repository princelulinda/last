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
  AccountCalculatedBalanceModel,
  AccountStatusModel,
  AccountTypeModel,
  ClientCorporateModel,
  ClientDetailModel,
  ClientLanguageWorkstationModel,
  ClientWorkstationModel,
  IndividualClientModel,
  LanguageWorkstationModel,
  ResponseDataAfterUpdate,
  ResponseDataForClientModel,
  ResponseDataForCorporateModel,
  ResponseMOdel,
  SignatoriesAccountsModel,
  SignatoriesConfigsModel,
  SignatoriesModel,
  SignatoryGroupsModel,
} from '../../../components/client/client.model';
import { PaginationConfig } from '../../../global/models/pagination.models';

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
    clientId: number | string
  ): Observable<{ objects: AccountsListModel[] }> {
    const url = '/accounts/' + clientId + '/';
    return this.apiService.get<{ objects: AccountsListModel[] }>(url);
  }

  getAccountTypeList(
    clientCategoryId: string,
    clientTypeCategoryId: string,
    branchId: string | null
  ): Observable<{ objects: AccountTypeModel[] }> {
    const url = `/account/config/defaults/?client_category=${clientCategoryId}&client_category_type=${clientTypeCategoryId}&branch=${branchId}`;
    return this.apiService.get<{ objects: AccountTypeModel[] }>(url);
  }

  getAccountCalculatedBalance(
    selectedAccount: string
  ): Observable<{ object: AccountCalculatedBalanceModel }> {
    const url = `/account/${selectedAccount}/transactions/balance/`;

    return this.apiService.get<{ object: AccountCalculatedBalanceModel }>(url);
  }

  getWalletType(): Observable<{ objects: WalletTypModel[] }> {
    const url = '/dbs/wallettype/list/';
    return this.apiService.get<{ objects: WalletTypModel[] }>(url);
  }

  changeAccountType(
    account: string,
    acc_defaults: string,
    pin: string
  ): Observable<ResponseMOdel> {
    const url = '/account/config/defaults/update/';
    const body = {
      account,
      acc_defaults,
      pin,
    };
    return this.apiService.post(url, body).pipe(
      map(response => {
        return response as ResponseMOdel;
      })
    );
  }

  updateClientAccountDetails(
    selectedAccount: string,
    acc_debitor_rate: string,
    acc_creditor_rate: string,
    acc_reserved_balance_upd: string
  ): Observable<ResponseMOdel> {
    const url = '/clients/manage/accounts/' + selectedAccount + '/';
    const body = {
      selectedAccount,
      acc_debitor_rate,
      acc_creditor_rate,
      acc_reserved_balance_upd,
    };
    return this.apiService.patch(url, body).pipe(
      map(response => {
        return response as ResponseMOdel;
      })
    );
  }

  changeAccountStatus(
    account_status: string,
    status_reason: string,
    reason_explained: string,
    clients: string
  ): Observable<ResponseMOdel> {
    const url = '/accounts/status/change/';
    const body = {
      account_status,
      status_reason,
      reason_explained,
      clients,
    };
    return this.apiService.post(url, body).pipe(
      map(response => {
        return response as ResponseMOdel;
      })
    );
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

  createAccount(
    branch: number | null,
    client: number | string,
    account_type: number | null,
    sync: string,
    acc_title: string
  ): Observable<ResponseMOdel> {
    const url = '/dbs/wallet/create/';
    const body = {
      branch,
      client,
      account_type,
      sync,
      acc_title,
    };
    return this.apiService.post(url, body).pipe(
      map(response => {
        return response as ResponseMOdel;
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

  getClientDetail(clientId: string) {
    const url = '/clients/list/all/' + clientId + '/';
    return this.apiService
      .get<{ object: ClientDetailModel }>(url)
      .pipe(map(data => data));
  }

  getClientAccountStatus(accountId: string) {
    const url = `/account/status/list/?account_id=${accountId}`;
    return this.apiService
      .get<{ objects: AccountStatusModel[] }>(url)
      .pipe(map(data => data));
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

  UpdateIndividualClientDetails(
    clientId: string,
    data: object
  ): Observable<{ object: ResponseDataForClientModel }> {
    return this.apiService
      .patch(`/clients/manage/individuals/${clientId}/`, data)
      .pipe(
        map(data => {
          return data as { object: ResponseDataForClientModel };
        })
      );
  }
  UpdateCorporateDetails(
    clientId: string,
    data: object
  ): Observable<{ object: ResponseDataForCorporateModel }> {
    return this.apiService
      .patch(`/clients/manage/corporate/${clientId}/`, data)
      .pipe(
        map(data => {
          return data as { object: ResponseDataForCorporateModel };
        })
      );
  }

  modifyCategoryCorporate(
    clientId: string,
    categoryId: number,

    data: object
  ) {
    return this.apiService
      .post<{
        object: ResponseDataAfterUpdate;
      }>(
        `/client/elements/update/${clientId}/?client_category=${categoryId}`,
        data
      )
      .pipe(
        map(data => {
          return data as { object: ResponseDataAfterUpdate };
        })
      );
  }

  modifySectorCorporate(
    clientId: string,

    sectorId: number,
    data: object
  ) {
    return this.apiService
      .post<{
        object: ResponseDataAfterUpdate;
      }>(
        `/client/elements/update/${clientId}/?&activity_sector=${sectorId}`,
        data
      )
      .pipe(
        map(data => {
          return data as { object: ResponseDataAfterUpdate };
        })
      );
  }

  addSignatoryConfig(body: object) {
    const url = '/client/erp-signatories-configs/';
    return this.apiService
      .post<SignatoriesConfigsModel>(url, body)
      .pipe(map(response => response));
  }

  getSignaroryConfigList(pagination?: PaginationConfig) {
    return this.apiService
      .get<{
        objects: SignatoriesConfigsModel[];
        count: number;
      }>(`/client/erp-signatories-configs/?limit=${pagination?.filters.limit}&offset=${pagination?.filters.offset}`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  getSignaroryConfigDetails(configurationId: number) {
    return this.apiService
      .get<{
        object: SignatoriesConfigsModel;
      }>(`/client/erp-signatories-configs/${configurationId}/`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  getSignaroryConfigGroups() {
    return this.apiService
      .get<{ objects: SignatoryGroupsModel[] }>(`/client/erp-signatory-groups/`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  getSignarories() {
    return this.apiService
      .get<{ object: SignatoriesModel }>(`/client/erp-signatories/`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  getSignaroriesAccounts() {
    return this.apiService
      .get<{
        object: SignatoriesAccountsModel;
      }>(`/client/erp-signatories-accounts/`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  addSignatoryGroups(body: object) {
    const url = '/client/erp-signatory-groups/';
    return this.apiService
      .post<{ object: SignatoryGroupsModel }>(url, body)
      .pipe(map(response => response));
  }
}
