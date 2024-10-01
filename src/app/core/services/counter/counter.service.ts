import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { PaginationConfig } from '../../../global/models/pagination.models';
import { map, Observable } from 'rxjs';
import {
  AssignOperatorBodyModel,
  AssignOperatorModel,
  CounterDetailsModel,
  CounterTellerModel,
  CounterTreasurerModel,
  MainBoxModel,
  OperationListModel,
  OperationTransactionModel,
} from '../../../components/dev/operations/operation.model';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  constructor(private apiService: ApiService) {}

  getOperationsList(
    search: string,
    pagination: PaginationConfig,
    type: string
  ): Observable<{
    objects: OperationListModel[];
    count: number;
  }> {
    const url = `/dsl/operations/pending/logic/?req_type=${type}&limit=${pagination.filters.limit}&offset=${pagination.filters.offset}`;
    // let dateFilter = '';
    // if (search && params.length == 0) {
    //   url = `/dsl/operations/pending/logic/?search=${search}&limit=${pagination.filters.limit}&offset=${pagination.filters.offset}`;
    // }
    // if (params.length > 0) {
    //   for (const param of params) {
    //     dateFilter = dateFilter + '&' + param.title + '=' + param.value;
    //     if (search) {
    //       url =
    //         `/dsl/operations/pending/logic/?search=${search}&limit=${pagination.filters.limit}&offset=${pagination.filters.offset}&` +
    //         dateFilter;
    //     } else {
    //       url =
    //         `/dsl/operations/pending/logic/?limit=${pagination.filters.limit}&offset=${pagination.filters.offset}&` +
    //         dateFilter;
    //     }
    //   }
    // } else {
    //   dateFilter = '';
    // }
    return this.apiService
      .get<{
        objects: OperationListModel[];
        count: number;
      }>(url)
      .pipe(map(data => data));
  }
  getOperationTransactions(
    operationId: number,
    pagination: PaginationConfig
  ): Observable<{
    objects: OperationTransactionModel[];
    count: number;
  }> {
    const url = `/operations/all/statement/?trans_pending_operation=${operationId}&limit=${pagination.filters.limit}&offset=${pagination.filters.offset}`;
    return this.apiService
      .get<{
        objects: OperationTransactionModel[];
        count: number;
      }>(url)
      .pipe(map(data => data));
  }

  //counters
  getCounters(search = '', pagination: PaginationConfig) {
    const url = `/hr/counter/?search=${search}&limit=${pagination.filters.limit}&offset=${pagination.filters.offset}`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  getCounterDetails(
    counterId: number
  ): Observable<{ object: CounterDetailsModel }> {
    const url = `/hr/counter/${counterId}`;
    return this.apiService
      .get<{ object: CounterDetailsModel }>(url)
      .pipe(map(data => data));
  }

  assignOperatorToCounter(
    body: AssignOperatorBodyModel
  ): Observable<{ object: AssignOperatorModel }> {
    const url = '/hr/counter/operator/assignment/';
    return this.apiService
      .post<{ object: AssignOperatorModel }>(url, body)
      .pipe(map(data => data));
  }

  getCounterTeller(
    counterId: number
  ): Observable<{ objects: CounterTellerModel[] }> {
    const url = `/hr/tellers/list/?counter=${counterId}&`;
    return this.apiService
      .get<{ objects: CounterTellerModel[] }>(url)
      .pipe(map(data => data));
  }

  getCounterTreasurer(counterId: number): Observable<{
    objects: CounterTreasurerModel[];
    count: number;
  }> {
    const url = `/hr/treasurers/list/?counter=${counterId}&`;
    return this.apiService
      .get<{
        objects: CounterTreasurerModel[];
        count: number;
      }>(url)
      .pipe(map(data => data));
  }

  getCounterMainBox(
    counterId: number
  ): Observable<{ objects: MainBoxModel[] }> {
    const url = `/hr/counter-mainbox/?counter=${counterId}`;
    return this.apiService
      .get<{ objects: MainBoxModel[] }>(url)
      .pipe(map(data => data));
  }
}
