import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ApiService } from '..';
import { bankModel } from '../../../components/dashboards/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  constructor(@Inject(ApiService) private apiService: ApiService) {}

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
  getBanksList(): Observable<{ objects: bankModel[]; count: number }> {
    const url = '/banks/clientlist/?';
    return this.apiService
      .get<{ objects: bankModel[]; count: number }>(url)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  getBanksListAll(): Observable<{ objects: bankModel[]; count: number }> {
    const url = '/banks/list/?bank_type=MFI&list_for_add_bank=true';

    return this.apiService
      .get<{ objects: bankModel[]; count: number }>(url)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  addBank(body: []) {
    const url = '/client/clientorganization/';
    return this.apiService.post(url, body).pipe(map(response => response));
  }
  // withdrawFromAgent(withdraw: any) {
  //     return this.apiService.post('/dbs/agent/withdrawal/', withdraw).pipe(
  //         map((data) => {
  //             return data;
  //         })
  //     );
  // }

  getAccountStatements(
    accountId: number,
    dateFrom: { year: string; month: string; day: string },
    dateEnd: { year: string; month: string; day: string }
  ) {
    const url = `/operations/statement/?client_acc_id=${accountId}&year=${dateFrom.year}&year_to=${dateEnd.year}&month_from=${dateFrom.month}&day_from=${dateEnd.month}&month_to=${dateFrom.day}&day_to=${dateEnd.day}&limit=50&offset=0`;
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }

  // getBankStatusPing(body: any) {
  //     const url = `${environment.websocketUrl}ws/dbsapp/partners-ping/`;

  //     return this.httpClient.post(url, body).pipe(
  //         map((data) => {
  //             return data;
  //         })
  //     );
  // }
}
