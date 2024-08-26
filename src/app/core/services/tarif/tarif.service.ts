import { Injectable } from '@angular/core';
import { ApiService } from '..';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, switchMap } from 'rxjs';
import {
  tarifResponseModel,
  bankListResponseModel,
  feesResonseModel,
  simulateResponseModel,
} from '../../../components/tarif/tarif.model';

@Injectable({
  providedIn: 'root',
})
export class TarifService {
  private cancelPreviousRequest$ = new Subject<void>();
  private inputChanged$ = new Subject<string>();

  constructor(private apiService: ApiService) {
    //
  }

  getBanks(): Observable<{ objects: bankListResponseModel[] }> {
    const url = '/banks/list/?commission_type=I';
    return this.apiService.get<{ objects: bankListResponseModel[] }>(url);
  }

  getTarifType(bank_id: number): Observable<{ objects: tarifResponseModel[] }> {
    const url = '/dbs/tariff-table/?bank=' + bank_id;
    return this.apiService.get<{ objects: tarifResponseModel[] }>(url);
  }
  getAllTarifType() {
    const url = '/dbs/tariff-table/';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }

  getTarifFees(tarif_id: number): Observable<{ objects: feesResonseModel[] }> {
    const url = '/dbs/tariff-fees/?tarif_table=' + tarif_id;
    return this.apiService.get<{ objects: feesResonseModel[] }>(url);
  }

  TarifFees(tarif_id: string) {
    const url = '/dbs/tariff-fees/?tarif_table=' + tarif_id;
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }

  getSimulateWithTarifTable(
    tarifTable: number,
    amount: string
  ): Observable<{ objects: simulateResponseModel[] }> {
    const url = `/dbs/tariff-simulation/?tarif_table=${tarifTable}&amount=${amount}`;
    return this.apiService.get<{ objects: simulateResponseModel[] }>(url);
  }

  getSimulate(type_code: string, amount: string, bank: string) {
    this.inputChanged$.next(amount);
    return this.inputChanged$.pipe(
      switchMap(newAmount => {
        this.cancelPreviousRequest$.next();
        const url = `/dbs/tariff-simulation/?type_code=${type_code}&amount=${newAmount}&bank=${bank}`;
        return this.apiService
          .get(url)
          .pipe(takeUntil(this.cancelPreviousRequest$));
      })
    );
  }
  //   addTarif(body: any) {
  //       const url = '/dbs/tariff-type/';
  //       return this.apiService
  //           .post(url, body)
  //           .pipe(map((response) => response));
  //   }
}
