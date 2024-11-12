import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiService } from '../api/api.service';
import { LedgerReportsModel } from '../../../components/reports/ledger-reports.model';

@Injectable({
  providedIn: 'root',
})
export class AccountingService {
  constructor(private apiService: ApiService) {}

  getLedgerReport(
    type: 'balance-sheet' | 'operating-result'
  ): Observable<{ object: LedgerReportsModel }> {
    const url =
      type === 'balance-sheet'
        ? `/ledger-global-report/bilan/`
        : '/ledger-global-report/operating_result/';

    return this.apiService
      .get<{ object: LedgerReportsModel }>(url)
      .pipe(map(data => data));
  }
}
