// import { Injectable } from '@angular/core';
// import { ApiService } from '..';
// import { BehaviorSubject, Observable, map } from 'rxjs';
// import { SimulateLoanModel } from '../../../components/loan/loan.models';

// @Injectable({
//   providedIn: 'root',
// })
// export class LoanService {
//   // private _simulationResult: BehaviorSubject<any> = new BehaviorSubject<any>(
//   //   null
//   // );
//   // get simulationReslt$(): Observable<any> {
//   //   return this._simulationResult.asObservable();
//   // }

//   // private _loansLength: BehaviorSubject<number> = new BehaviorSubject<number>(
//   //   0
//   // );
//   // get loansLength$(): Observable<number> {
//   //   return this._loansLength.asObservable();
//   // }

//   // private _showLoanDetails: BehaviorSubject<boolean> =
//   //   new BehaviorSubject<boolean>(false);
//   // get showLoanDetails$(): Observable<boolean> {
//   //   return this._showLoanDetails.asObservable();
//   // }

//   // private _loanValue: BehaviorSubject<number> = new BehaviorSubject<number>(0);
//   // get loanValue$(): Observable<number> {
//   //   return this._loanValue.asObservable();
//   // }

//   // switchLoanDetails() {
//   //   this._loanValue.next(0);
//   // }

//   // toogleLoanDetails(bool: boolean) {
//   //   this._showLoanDetails.next(bool);
//   // }

//   constructor(private apiService: ApiService) {}

//   // getLoansLength(length: number) {
//   //   this._loansLength.next(length);
//   // }

//   getLoansList() {
//     const url = '/loans/clients/list/';
//     return this.apiService.get(url).pipe(map((data: any) => data));
//   }

//   getLoansListWithPagination(data: any) {
//     const url = `/loans/clients/list/?limit=${data.limit}&offset=${data.offset}`;
//     return this.apiService.get(url).pipe(map((data: any) => data));
//   }

//   // getSimulationResult(result: any) {
//   //   this._simulationResult.next(result);
//   // }

//   simulateLoan(body: SimulateLoanModel) {
//     const url = '/loans/simulation/';
//     return this.apiService.post(url, body).pipe(map((data: any) => data));
//   }

//   getLoanDetails(id: string) {
//     const url = '/loans/manage/';
//     return this.apiService.get(url + id).pipe(map((data: any) => data));
//   }

//   getAmortissmentPlan(id: string) {
//     const url = '/loans/plan/';
//     return this.apiService.get(url + id).pipe(map((data: any) => data));
//   }

//   payLoan(body: any) {
//     const url = '/loans/clients/plan/payment/';
//     return this.apiService.post(url, body).pipe(map((data: any) => data));
//   }

//   requestLoan(body: any) {
//     const url = '/loans/request/';
//     return this.apiService.post(url, body).pipe(map((data: any) => data));
//   }

//   getLoanType() {
//     const url = '/loans/loan-type/';
//     return this.apiService.get(url).pipe(map((data: any) => data));
//   }

//   getLoanTypeInfo(data: any) {
//     const url = `/loans/defaults-check/?account=${data.account_id}&loan_type=${data.loan_type_id}`;
//     return this.apiService.get(url).pipe(map((data: any) => data));
//   }

//   getPendingLoans(data: any) {
//     const url = `/loans/request/?limit=${data.limit}&offset=${data.offset}&client_id=${data.client_id}`;
//     return this.apiService.get(url).pipe(map((data: any) => data));
//   }

//   getLoanListByClient(client_id: string) {
//     const url = `/loans/manage/?cred_client_main_account__acc_client=${client_id}`;
//     return this.apiService.get(url).pipe(map((data: any) => data));
//   }

//   getLoanLineListByClient(client_id: string) {
//     const url = `/loans/manage/creditline/?crel_account__acc_client=${client_id}`;
//     return this.apiService.get(url).pipe(map((data: any) => data));
//   }

//   getLoanDetailsByClient(client_id: string, accountId: string) {
//     const url = `/loans/manage/?cred_client_main_account__acc_client=${client_id}&cred_client_main_account=${accountId}`;
//     return this.apiService.get(url).pipe(map((data: any) => data));
//   }
// }
