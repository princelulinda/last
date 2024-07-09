import { Inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { map, Observable } from 'rxjs';
import { nyamuranziCard } from '../../../components/nyamuranzi/models';
import { WalletCard } from '../../../components/wallet/models';

@Injectable({
  providedIn: 'root',
})
export class BankingService {
  constructor(@Inject(ApiService) private apiService: ApiService) {}

  getDefaultAccount() {
    const url = '/account/current/default/';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getDefaultWallet(): Observable<{ object: WalletCard; count: number }> {
    const url = '/dbs/wallet/default/';
    return this.apiService.get<{ object: WalletCard; count: number }>(url).pipe(
      map(data => {
        return data;
      })
    );
  }

  getRecentTransactions() {
    const url = '/operations/pending/logic/?filter_for_client=true/';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getRefereePersons(): Observable<{ object: nyamuranziCard }> {
    return this.apiService
      .get<{ object: nyamuranziCard }>('/client/refered/')
      .pipe(map(data => data));
  }
}
