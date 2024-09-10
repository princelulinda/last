import { Injectable } from '@angular/core';
import { ApiService } from '..';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, switchMap } from 'rxjs';
import {
  TarifResponseModel,
  BankListResponseModel,
  FeesResonseModel,
  SimulateResponseModel,
} from '../../../components/tarif/tarif.model';
import {
  AddTarifModel,
  TarifFeesResonseModel,
  TarifTypeModel,
} from '../../../components/configutarion-tarif/configuration-tarif-model';

@Injectable({
  providedIn: 'root',
})
export class TarifService {
  private cancelPreviousRequest$ = new Subject<void>();
  private inputChanged$ = new Subject<string>();

  constructor(private apiService: ApiService) {
    //
  }

  getBanks(): Observable<{ objects: BankListResponseModel[] }> {
    const url = '/banks/list/?commission_type=I';
    return this.apiService.get<{ objects: BankListResponseModel[] }>(url);
  }

  getTarifType(bank_id: number): Observable<{ objects: TarifResponseModel[] }> {
    const url = '/dbs/tariff-table/?bank=' + bank_id;
    return this.apiService.get<{ objects: TarifResponseModel[] }>(url);
  }
  getAllTarifType(): Observable<{ objects: TarifTypeModel[] }> {
    const url = '/dbs/tariff-table/';
    return this.apiService.get<{ objects: TarifTypeModel[] }>(url);
  }

  getTarifFees(tarif_id: number): Observable<{ objects: FeesResonseModel[] }> {
    const url = '/dbs/tariff-fees/?tarif_table=' + tarif_id;
    return this.apiService.get<{ objects: FeesResonseModel[] }>(url);
  }

  TarifFees(
    tarif_id: string
  ): Observable<{ objects: TarifFeesResonseModel[] }> {
    const url = '/dbs/tariff-fees/?tarif_table=' + tarif_id;
    return this.apiService.get<{ objects: TarifFeesResonseModel[] }>(url);
  }

  getSimulateWithTarifTable(
    tarifTable: number,
    amount: string
  ): Observable<{ objects: SimulateResponseModel[] }> {
    const url = `/dbs/tariff-simulation/?tarif_table=${tarifTable}&amount=${amount}`;
    return this.apiService.get<{ objects: SimulateResponseModel[] }>(url);
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
  addTarif(body: object): Observable<AddTarifModel> {
    const url = '/dbs/tariff-type/';
    return this.apiService
      .post(url, body)
      .pipe(map(response => response as AddTarifModel));
  }
}
