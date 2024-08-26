import { Injectable } from '@angular/core';
import { ApiService } from '..';
import { Observable } from 'rxjs';
import {
  activeSessionResponseModel,
  historySessionResponseModel,
} from '../../../components/settings/settings.models';
import { PaginationConfig } from '../../../global/models/pagination.models';
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
  ): Observable<activeSessionResponseModel> {
    const url = `/erp/session/?active=true&search=${search}&limit=${pagination.filters.limit}&offset=${pagination.filters.offset}`;
    return this.apiService.get(url);
  }

  getHistorySessions(
    search = '',
    pagination: PaginationConfig
  ): Observable<historySessionResponseModel> {
    const url = `/erp/session/?active=false&search=${search}&limit=${pagination.filters.limit}&offset=${pagination.filters.offset}`;
    return this.apiService.get(url);
  }

  getUserSession() {
    const url = `/erp/session/current_session/`;
    return this.apiService.get(url);
  }

  endSession(sessionId: string): Observable<activeSessionResponseModel> {
    const url = `/erp/session/${sessionId}/close/`;
    return this.apiService.post(url);
  }
}
