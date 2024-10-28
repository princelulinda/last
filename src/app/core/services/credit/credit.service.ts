import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CreditListModel } from '../../../components/loan/loan.models';

@Injectable({
  providedIn: 'root',
})
export class CreditService {
  constructor(private apiService: ApiService) {}

  getCreditsList(): Observable<{ count: number; objects: CreditListModel }> {
    const apiUrl = '/loans/manage/';
    return this.apiService
      .get<{ count: number; objects: CreditListModel }>(apiUrl)
      .pipe(map(data => data));
  }

  // creditRequest(body: any) {
  //   const url = '/loans/request/';
  //   return this.apiService.post(url, body).pipe(map(response => response));
  // }
}
