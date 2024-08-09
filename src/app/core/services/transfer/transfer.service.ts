import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import {
  InstitutionInfoModel,
  TransferResponseModel,
} from '../../../components/transfer/transfer.model';

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  //   private _currentBalance: BehaviorSubject<any> = new BehaviorSubject<any>(
  //     null
  // );
  // get currentBalance$(): Observable<any> {
  //     return this._currentBalance.asObservable();
  // }

  private _transfersLength: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  get transfersLength$(): Observable<number> {
    return this._transfersLength.asObservable();
  }
  // private _isBalanceShown: BehaviorSubject<boolean> =
  //     new BehaviorSubject<boolean>(false);
  // get isBalanceShown$(): Observable<boolean> {
  //     return this._isBalanceShown.asObservable();
  // }
  private _isTransfer: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  get isTransfer$(): Observable<boolean> {
    return this._isTransfer.asObservable();
  }
  // private _lastTransaction: BehaviorSubject<any> = new BehaviorSubject<any>(
  //     {}
  // );
  // get lastTransaction$(): Observable<any> {
  //     return this._lastTransaction.asObservable();
  // }
  constructor(private apiService: ApiService) {
    //
  }
  getTransfersLength(length: number) {
    this._transfersLength.next(length);
  }
  // goToLastTransaction(transaction: any) {
  //     this._lastTransaction.next(transaction);
  //     //console.log('hello transaction', transaction);
  // }
  // getCurrentBalance(amount: number) {
  //     this._currentBalance.next(amount);
  // }
  handleTransfer(arg: boolean) {
    this._isTransfer.next(arg);
  }

  getInstitutionsList(
    type: object
  ): Observable<{ objects: InstitutionInfoModel[]; count: number }> {
    const url = '/banks/list?bank_type=' + type;
    return this.apiService
      .get<{ objects: InstitutionInfoModel[]; count: number }>(url)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  // getAccountsList() {
  //     const url = '/accounts/user/list/';
  //     return this.apiService.get(url).pipe(
  //         map((data: any) => {
  //             return data;
  //         })
  //     );
  // }

  // getWalletsList(clientId: any) {
  //     const url = '/dbs/wallet/list/';
  //     return this.apiService.get(url).pipe(
  //         map((data: any) => {
  //             return data;
  //         })
  //     );
  // }
  // getDefaultAccount() {
  //     const url = '/account/current/default/';
  //     return this.apiService.get(url).pipe(
  //         map((data: any) => {
  //             return data;
  //         })
  //     );
  // }
  lookupAccount(data: object): Observable<TransferResponseModel> {
    return this.apiService
      .post('/banks/clientlookup/', data)
      .pipe(map(data => data as TransferResponseModel));
  }
  doTransfer(data: object): Observable<TransferResponseModel> {
    return this.apiService
      .post('/operations/transfer/', data)
      .pipe(map(data => data as TransferResponseModel));
  }
  // topUpWallet(data: any) {
  //     return this.apiService
  //         .post('/dbs/wallet/topup/', data)
  //         .pipe(map((data) => data));
  // }
  getTransfersList() {
    return this.apiService
      .get(
        '/operations/pending/logic/?req_type=transfers&filter_for_client=true'
      )
      .pipe(map(data => data));
  }
  // getRecentTransactions(type: string, period: any = {}, client: any) {
  //     return this.apiService
  //         .get(
  //             `/operations/pending/logic/?req_type=${type}&=date_from=${period.start_date}&=date_to=${period.end_date}` +
  //                 client
  //         )
  //         .pipe(map((data) => data));
  // }
  // getConnectedClient() {
  //     return this.apiService
  //         .get('/client/user/populate/')
  //         .pipe(map((data) => data));
  // }
  // toggleBalance() {
  //     this._isBalanceShown.next(!this._isBalanceShown.value);
  //     console.log('toggle', this._isBalanceShown.value);
  // }
  // getLastBeneficiary() {
  //     const url = '/operations/beneficiary/';
  //     return this.apiService.get(url).pipe(
  //         map((data: any) => {
  //             return data;
  //         })
  //     );
  // }
  // depositWithAgent(deposit: any) {
  //     return this.apiService.post('/dbs/agent/deposit/', deposit).pipe(
  //         map((data: any) => {
  //             return data;
  //         })
  //     );
  // }
}
