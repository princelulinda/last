import { Injectable } from '@angular/core';
import { ApiService } from '..';
import { BehaviorSubject, map, Observable } from 'rxjs';
import {
  BodyLoanModel,
  LoanListResponseModel,
  LoanModel,
  LoanPendingModel,
  LoanPlanResponseModel,
  LoanTypeModel,
  PayLoanModel,
  ResponseDataModel,
  SimulateLoanModel,
  SimulationResDataModel,
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

  // private _loanValue: BehaviorSubject<any> = new BehaviorSubject<any>(
  //   undefined
  // );

  // get loanValue$(): Observable<any> {
  //   return this._loanValue.asObservable();
  // }
  constructor(private apiService: ApiService) {}

  // switchLoanDetails() {
  //   this._loanValue.next(undefined);
  // }
  toggleLoanDetails(show: boolean) {
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
  }): Observable<{ object: LoanListResponseModel }> {
    return this.apiService.get(
      `/loans/clients/list/?limit=${limit}&offset=${offset}`
    );
  }
  getSimulationResult(result: SimulationResModel) {
    this._simulationResult.next(result);
  }
  simulateLoan(
    body: SimulateLoanModel
  ): Observable<{ object: SimulationResDataModel }> {
    return this.apiService
      .post('/loans/simulation/', body)
      .pipe(map(data => data as { object: SimulationResDataModel }));
  }
  getLoanDetails(id: string) {
    return this.apiService.get(`/loans/manage/${id}/`);
  }
  getAmortizationPlan(
    id: string
  ): Observable<{ object: LoanPlanResponseModel }> {
    return this.apiService.get(`/loans/plan/${id}/`);
  }
  payLoan(body: PayLoanModel) {
    return this.apiService.post('/loans/clients/plan/payment/', body);
  }
  requestLoan(body: BodyLoanModel): Observable<{ object: LoanPendingModel }> {
    return this.apiService.post('/loans/request/', body);
  }
  getLoanType(): Observable<{ objects: LoanTypeModel }> {
    return this.apiService.get('/loans/loan-type/');
  }
  getLoanTypeInfo({
    account_id,
    loan_type_id,
  }: {
    account_id: string;
    loan_type_id: string;
  }): Observable<{ object: ResponseDataModel }> {
    return this.apiService.get(
      `/loans/defaults-check/?account=${account_id}&loan_type=${loan_type_id}`
    );
  }

  getLoanRequestDetails(loanId: string): Observable<{ object: LoanModel }> {
    const url = `/loans/request/${loanId}/`;
    return this.apiService
      .get(url)
      .pipe(map(data => data as { object: LoanModel }));
  }

  getPendingLoans({
    limit,
    offset,
    client_id,
  }: {
    limit: number;
    offset: number;
    client_id: string;
  }): Observable<{ objects: LoanPendingModel[]; count: number }> {
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

  getCreditDetails(creditId: string | number) {
    const apiUrl = '/loans/manage/' + creditId + '/';
    return this.apiService.get(apiUrl).pipe(map(data => data));
  }
}
