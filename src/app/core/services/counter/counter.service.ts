import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { PaginationConfig } from '../../../global/models/pagination.models';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  constructor(private apiService: ApiService) {}

  getOperationsList(
    search: string,
    pagination: PaginationConfig,
    type: string
  ) {
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
    return this.apiService.get(url).pipe(map(data => data));
  }
  getOperationTransactions(operationId: number, pagination: PaginationConfig) {
    const url = `/operations/all/statement/?trans_pending_operation=${operationId}&limit=${pagination.filters.limit}&offset=${pagination.filters.offset}`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  //counters
  getCounters(search = '', pagination: PaginationConfig) {
    const url = `/hr/counter/?search=${search}&limit=${pagination.filters.limit}&offset=${pagination.filters.offset}`;
    return this.apiService.get(url).pipe(map(data => data));
  }
}
