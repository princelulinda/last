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

  constructor(private apiService: ApiService) {
    //
  }
  getTransfersLength(length: number) {
    this._transfersLength.next(length);
  }

  handleTransfer(arg: boolean) {
    this._isTransfer.next(arg);
  }

  getInstitutionsList(
    type: object
  ): Observable<{ objects: InstitutionInfoModel[]; count: number }> {
    const url = `/banks/list/?bank_type=${type}&cashin_only=true`;
    return this.apiService
      .get<{ objects: InstitutionInfoModel[]; count: number }>(url)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

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

  getTransfersList() {
    return this.apiService
      .get(
        '/operations/pending/logic/?req_type=transfers&filter_for_client=true'
      )
      .pipe(map(data => data));
  }
}
