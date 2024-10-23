import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountingService {
  constructor(private apiService: ApiService) {}

  getBalanceSheet() {
    const url = `/ledger-global-report/bilan`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  getOperatingResult() {
    const url = `/ledger-global-report/operating_result`;
    return this.apiService.get(url).pipe(map(data => data));
  }
}
