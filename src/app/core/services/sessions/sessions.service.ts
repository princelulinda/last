import { Injectable } from '@angular/core';
import { ApiService } from '..';
import { Observable } from 'rxjs';
import { PaginationConfig } from '../../../global/global.model';
import {
  activeSessionResponse,
  historySessionResponse,
} from '../../../components/settings/settings.models';
@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  constructor(private apiService: ApiService) {}

  //   getActiveSession() {
  //     const url = '/erp/session/?active=true';
  //     return this.apiService.get(url).pipe(
  //         map((data: any) => {
  //             return data;
  //         })
  //     );
  // }
  getActiveSession(
    search = '',
    pagination: PaginationConfig
  ): Observable<activeSessionResponse> {
    const url = `/erp/session/?active=true&search=${search}&limit=${pagination.filters.limit}&offset=${pagination.filters.offset}`;
    return this.apiService.get(url);
  }

  getHistorySessions(
    search = '',
    pagination: PaginationConfig
  ): Observable<historySessionResponse> {
    const url = `/erp/session/?active=false&search=${search}&limit=${pagination.filters.limit}&offset=${pagination.filters.offset}`;
    return this.apiService.get(url);
  }
}
