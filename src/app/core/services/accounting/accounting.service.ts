import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { map, Observable } from 'rxjs';
import { BilanResponseModel } from '../../../components/dev/accounting/accounting.model';

@Injectable({
  providedIn: 'root',
})
export class AccountingService {
  constructor(private apiService: ApiService) {}

  getBalanceSheet(): Observable<{ object: BilanResponseModel }> {
    const url = `/ledger-global-report/bilan/`;
    return this.apiService
      .get<{ object: BilanResponseModel }>(url)
      .pipe(map(data => data));
  }

  getOperatingResult(): Observable<{ object: BilanResponseModel }> {
    const url = `/ledger-global-report/operating_result/`;
    return this.apiService
      .get<{ object: BilanResponseModel }>(url)
      .pipe(map(data => data));
  }
}
