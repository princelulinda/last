import { Injectable } from '@angular/core';
import { ApiService } from '..';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs';
import {
  TarifResponseModel,
  BankListResponseModel,
  FeesResonseModel,
  SimulateResponseModel,
} from '../../../components/tarifs/tarif.model';
import {
  AddTarifModel,
  TarifFeesResonseModel,
  TarifTypeModel,
  AddFeesModel,
  AddTarifBodyModel,
  AddTarifToTableBodyModel,
  ModifyFeesBodyModel,
  ModifyFeesModel,
  AddFeesBodyModel,
  DeleteFeesModel,
} from '../../../components/tarifs/tarif.model';

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

  addTarif(body: AddTarifBodyModel): Observable<AddTarifModel> {
    const url = '/dbs/tariff-type/';
    return this.apiService
      .post<AddTarifModel>(url, body)
      .pipe(map(response => response));
  }
  addTarifToTable(body: AddTarifToTableBodyModel): Observable<AddTarifModel> {
    const url = '/dbs/tariff-table/';
    return this.apiService
      .post<AddTarifModel>(url, body)
      .pipe(map(response => response));
  }

  addFees(body: AddFeesBodyModel): Observable<AddFeesModel> {
    const url = '/dbs/tariff-fees/';
    return this.apiService
      .post<AddFeesModel>(url, body)
      .pipe(map(response => response));
  }

  modifyFees(
    feeId: string,
    body: ModifyFeesBodyModel
  ): Observable<ModifyFeesModel> {
    const url = '/dbs/tariff-fees/' + feeId + '/';
    return this.apiService
      .patch(url, body)
      .pipe(map(response => response as AddFeesModel));
  }
  deleteFees(feeId: string): Observable<DeleteFeesModel> {
    const url = '/dbs/tariff-fees/' + feeId + '/';
    return this.apiService
      .delete(url)
      .pipe(map(response => response as DeleteFeesModel));
  }
}
