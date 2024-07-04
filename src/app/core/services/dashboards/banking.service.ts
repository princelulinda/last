import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BankingService {
  constructor() {
    //
  }

  //   getDefaultAccount() {
  //     const url = '/account/current/default/';
  //     return this.apiService.get(url).pipe(
  //         map((data: any) => {
  //             return data;
  //         })
  //     );
  // }
  // getDefaultWallet() {
  //   const url = '/dbs/wallet/default/';
  //   return this.apiService.get(url).pipe(
  //       map((data: any) => {
  //           return data;
  //       })
  //   );
  // }

  // getRecentTransactions() {
  //   const url = '/operations/pending/logic/?filter_for_client=true/';
  //   return this.apiService.get(url).pipe(
  //       map((data: any) => {
  //           return data;
  //       })
  //   );
  // }
  // getRefereePersons() {
  //   return this.apiService
  //       .get('/client/refered/')
  //       .pipe(map((data) => data));
  // }
}
