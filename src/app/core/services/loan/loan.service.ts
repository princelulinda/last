import { Injectable } from '@angular/core';
import { ApiService } from '..';
import { BehaviorSubject, map } from 'rxjs';
import {
  BodyLoanModel,
  ResponseDataModel,
  SimulateLoanModel,
  SimulationResModel,
} from '../../../components/loan/loan.models';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private _simulationResult = new BehaviorSubject<SimulationResModel | null>(
    null
  );
  simulationResult$ = this._simulationResult.asObservable();

  private _loansLength = new BehaviorSubject<number>(0);
  loansLength$ = this._loansLength.asObservable();

  private _showLoanDetails = new BehaviorSubject<boolean>(false);
  showLoanDetails$ = this._showLoanDetails.asObservable();

  private _loanValue = new BehaviorSubject<number>(0);
  loanValue$ = this._loanValue.asObservable();

  constructor(private apiService: ApiService) {}

  switchLoanDetails() {
    this._loanValue.next(0);
  }
  toogleLoanDetails(show: boolean) {
    this._showLoanDetails.next(show);
  }
  // getLoansLength(length: number) {
  //   this._loansLength.next(length);
  // }
  getLoansList() {
    return this.apiService.get('/loans/clients/list/');
  }

  getLoansListWithPagination({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }) {
    return this.apiService.get(
      `/loans/clients/list/?limit=${limit}&offset=${offset}`
    );
  }
  getSimulationResult(result: SimulationResModel) {
    this._simulationResult.next(result);
  }
  simulateLoan(body: SimulateLoanModel) {
    return this.apiService
      .post('/loans/simulation/', body)
      .pipe(map(data => data as { object: ResponseDataModel }));
  }
  getLoanDetails(id: string) {
    return this.apiService.get(`/loans/manage/${id}`);
  }
  getAmortizationPlan(id: string) {
    return this.apiService.get(`/loans/plan/${id}`);
  }
  // payLoan(body: any) {
  //   return this.apiService.post('/loans/clients/plan/payment/', body);
  // }
  requestLoan(body: BodyLoanModel) {
    return this.apiService.post('/loans/request/', body);
  }
  getLoanType() {
    return this.apiService.get('/loans/loan-type/');
  }
  getLoanTypeInfo({
    account_id,
    loan_type_id,
  }: {
    account_id: string;
    loan_type_id: string;
  }) {
    return this.apiService.get(
      `/loans/defaults-check/?account=${account_id}&loan_type=${loan_type_id}`
    );
  }
  getPendingLoans({
    limit,
    offset,
    client_id,
  }: {
    limit: number;
    offset: number;
    client_id: string;
  }) {
    return this.apiService.get(
      `/loans/request/?limit=${limit}&offset=${offset}&client_id=${client_id}`
    );
  }
  getLoanListByClient(client_id: string) {
    return this.apiService.get(
      `/loans/manage/?cred_client_main_account__acc_client=${client_id}`
    );
  }
  getLoanLineListByClient(client_id: string) {
    return this.apiService.get(
      `/loans/manage/creditline/?crel_account__acc_client=${client_id}`
    );
  }
  getLoanDetailsByClient(client_id: string, accountId: string) {
    return this.apiService.get(
      `/loans/manage/?cred_client_main_account__acc_client=${client_id}&cred_client_main_account=${accountId}`
    );
  }
}
