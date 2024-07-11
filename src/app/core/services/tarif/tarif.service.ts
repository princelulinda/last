import { Injectable } from '@angular/core';
import { ApiService } from '..';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, switchMap } from 'rxjs';
import {
  tarifResponse,
  bankListResponse,
  feesResonse,
  simulateResponse,
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

  getBanks(): Observable<{ objects: bankListResponse[] }> {
    const url = '/banks/list/?commission_type=I';
    return this.apiService.get<{ objects: bankListResponse[] }>(url);
  }

  getTarifType(bank_id: number): Observable<{ objects: tarifResponse[] }> {
    const url = '/dbs/tariff-table/?bank=' + bank_id;
    return this.apiService.get<{ objects: tarifResponse[] }>(url);
  }
  getAllTarifType() {
    const url = '/dbs/tariff-table/';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }

  getTarifFees(tarif_id: number): Observable<{ objects: feesResonse[] }> {
    const url = '/dbs/tariff-fees/?tarif_table=' + tarif_id;
    return this.apiService.get<{ objects: feesResonse[] }>(url);
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
  ): Observable<{ objects: simulateResponse[] }> {
    const url = `/dbs/tariff-simulation/?tarif_table=${tarifTable}&amount=${amount}`;
    return this.apiService.get<{ objects: simulateResponse[] }>(url);
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
