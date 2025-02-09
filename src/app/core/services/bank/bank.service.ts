import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, map } from 'rxjs';
import { BankListResponseModel } from '../../../components/auth/auth.model';
import { ApiService, ConfigService } from '..';
import { BankModel } from '../../db/models/bank/bank.model';
import { addBankResponse } from '../../../components/dashboards/dashboard.model';

import { WalletModel } from '../../../components/wallet/wallet.models';
import { nyamuranziCardModel } from '../../../components/nyamuranzi/nyamuranzi.models';
import { WithdrawalBodyModel } from '../../../components/withdrawal/withdrawal.models';
import { DissectedDateModel } from '../../../components/statements/statement.model';
import { PaginationConfig } from '../../../global/models/pagination.models';
import { TransactionModel } from '../../../components/merchant/products/products.model';
import { InstitutionInfoModel } from '../../../components/transfer/transfer.model';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  constructor(
    private apiService: ApiService,
    private configService: ConfigService
  ) {}

  private _isTransactionDone: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  get isTransactionDone$(): Observable<boolean> {
    return this._isTransactionDone.asObservable();
  }

  updateTransaction(bool: boolean) {
    this._isTransactionDone.next(bool);
  }

  private _isBankingAndServicesSelected: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  get _isBankingAndServicesSelected$(): Observable<boolean> {
    return this._isBankingAndServicesSelected.asObservable();
  }

  handleBanking(arg: boolean) {
    this._isBankingAndServicesSelected.next(arg);
  }

  getBanksList(): Observable<BankModel[]> {
    const url = '/banks/clientlist/?';
    return this.apiService
      .get<{ objects: BankModel[]; count: number }>(url)
      .pipe(
        map(data => {
          const banks = data.objects;
          this.configService.setUserBanks(banks);
          return banks;
        })
      );
  }
  getBanksListAll(): Observable<{ objects: BankModel[]; count: number }> {
    const url = '/banks/list/?bank_type=MFI&list_for_add_bank=true';

    return this.apiService
      .get<{ objects: BankModel[]; count: number }>(url)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  addBank(body: object): Observable<addBankResponse> {
    const url = '/client/clientorganization/';
    return this.apiService
      .post(url, body)
      .pipe(map(response => response as addBankResponse));
  }
  withdrawFromAgent(withdraw: WithdrawalBodyModel) {
    return this.apiService.post('/dbs/agent/withdrawal/', withdraw).pipe(
      map(data => {
        return data;
      })
    );
  }
  getAccountStatements(
    accountId: number | string,
    dateFrom: { year: number; month: number; day: number },
    dateEnd: { year: number; month: number; day: number }
  ) {
    const url = `/operations/statement/?client_acc_id=${accountId}&year=${dateFrom.year}&year_to=${dateEnd.year}&month_from=${dateFrom.month}&day_from=${dateFrom.day}&month_to=${dateEnd.month}&day_to=${dateEnd.day}&limit=50&offset=0`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  dissectDate(date: Date): DissectedDateModel {
    const dissectedDate: DissectedDateModel = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };

    return dissectedDate;
  }
  getAllBanks(): Observable<{ objects: BankListResponseModel[] }> {
    const url = '/banks/list/?externel_request=true&bank_type=MFI';
    return this.apiService.get<{ objects: BankListResponseModel[] }>(url);
  }
  // getBankStatusPing(body: any) {
  //     const url = `${environment.websocketUrl}ws/dbsapp/partners-ping/`;

  //     return this.httpClient.post(url, body).pipe(
  //         map((data) => {
  //             return data;
  //         })
  //     );
  // }

  getRecentTransactions(
    pagination: PaginationConfig,
    type: string,
    period: {
      start_date: string;
      end_date: string;
    },
    client: string
  ) {
    if (!pagination) {
      pagination = { filters: { limit: 0, offset: 0 } };
    }
    return this.apiService
      .get<{
        objects: TransactionModel[];
      }>(
        `/operations/pending/logic/?req_type=${type}&=date_from=${period.start_date}&=date_to=${period.end_date}&limit=${pagination.filters?.limit}&offset=${pagination.filters?.offset}` +
          client
      )
      .pipe(map(data => data));
  }

  private _isTransfer: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  get isTransfer$(): Observable<boolean> {
    return this._isTransfer.asObservable();
  }

  getLastBeneficiary() {
    const url = '/operations/beneficiary/';
    return this.apiService.get<{ objects: TransactionModel[] }>(url).pipe(
      map((data: { objects: TransactionModel[] }) => {
        return data;
      })
    );
  }

  getTransfersList() {
    return this.apiService
      .get<{
        objects: TransactionModel[];
      }>('/operations/pending/logic/?req_type=transfers&filter_for_client=true')
      .pipe(map(data => data));
  }

  getDefaultAccount() {
    const url = '/account/current/default/';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getDefaultWallet(): Observable<{
    object: {
      success: boolean;
      response_data: WalletModel;
      response_message: string;
    };
    count: number;
  }> {
    return this.apiService
      .get<{
        object: {
          success: boolean;
          response_data: WalletModel;
          response_message: string;
        };
        count: number;
      }>('/dbs/wallet/default/')
      .pipe(map(data => data));
  }

  getClientRecentTransactions() {
    const url = '/operations/pending/logic/?filter_for_client=true/';
    return this.apiService.get(url).pipe(map(data => data));
  }

  getRefereePersons(): Observable<{ object: nyamuranziCardModel }> {
    return this.apiService
      .get<{ object: nyamuranziCardModel }>('/client/refered/')
      .pipe(map(data => data));
  }

  getAgentBanks(): Observable<{ objects: InstitutionInfoModel[] }> {
    const url = `/banks/list/?with_agent_api=true/`;
    return this.apiService
      .get<{ objects: InstitutionInfoModel[] }>(url)
      .pipe(map(data => data));
  }

  getAgentBanksList(): Observable<{ objects: BankModel[]; count: number }> {
    const url = '/banks/list/?bank_type=MF1';

    return this.apiService
      .get<{ objects: BankModel[]; count: number }>(url)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
}
