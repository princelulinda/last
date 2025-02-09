import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { PlateformModel } from '../config/main-config.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private localUserTokenKey = 'iHelaRyanjeUserToken';
  private localBankIdKey = 'iHelaRyanjeBankId';
  private localPlateformKey = 'iHelaRyanjePlaform';
  private localSelectedMenuTypeKey = 'iHelaRyanjeTypeMenu';
  private localSelectedMenuKey = 'iHelaRyanjeMenu';
  private localConnectedOperatorKey = 'iHelaRyanjeOperator';

  private headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .append('Accept', 'application/json');

  constructor(private http: HttpClient) {}

  private formatErrors(error: string) {
    return throwError(error);
  }

  getLocalToken(): string | null {
    const localToken = localStorage.getItem(this.localUserTokenKey);

    if (
      localToken === null ||
      localToken === undefined ||
      localToken === '' ||
      localToken === 'undefined' ||
      localToken === 'null'
    ) {
      localStorage.removeItem(this.localUserTokenKey);
      return null;
    } else {
      return localToken;
    }
  }

  setLocalToken(token: string) {
    localStorage.setItem(this.localUserTokenKey, token);
  }

  getLocalBankId(): string | null {
    const localBankId = localStorage.getItem(this.localBankIdKey);

    if (!localBankId) {
      localStorage.removeItem(this.localBankIdKey);
      return null;
    } else {
      return localBankId;
    }
  }

  setLocalBankId(bankId: number) {
    localStorage.setItem(this.localBankIdKey, bankId.toString());
  }
  resetLocalBankId() {
    localStorage.removeItem(this.localBankIdKey);
  }

  getLocalPlateform(): PlateformModel {
    const plateform = localStorage.getItem(this.localPlateformKey);
    return plateform as PlateformModel;
  }
  setLocalPlateform(plateform: PlateformModel) {
    localStorage.setItem(this.localPlateformKey, plateform);
  }

  setLocalSelectedTypeMenu(menu: string) {
    localStorage.setItem(this.localSelectedMenuTypeKey, menu);
  }
  getLocalSelectedTypeMenu(): string | null {
    return localStorage.getItem(this.localSelectedMenuTypeKey);
  }

  setLocalConnectedOperator(status: 'true' | 'false') {
    if (status === 'true') {
      localStorage.setItem(this.localConnectedOperatorKey, status);
    } else {
      localStorage.removeItem(this.localConnectedOperatorKey);
    }
  }
  getLocalConnectedOperator(): string | null {
    return localStorage.getItem(this.localConnectedOperatorKey);
  }

  setLocalSelectedMenu(menu_id: number) {
    localStorage.setItem(this.localSelectedMenuKey, menu_id.toString());
  }

  getLocalSelectedMenu(): string | null {
    return localStorage.getItem(this.localSelectedMenuKey);
  }

  clearLocalData() {
    localStorage.clear();
  }

  get<T>(
    path: string,
    params: HttpParams = new HttpParams(),
    headers: HttpHeaders = new HttpHeaders()
  ): Observable<T> {
    if (headers['lazyUpdate']) {
      this.headers = headers;
    }

    return this.http
      .get(`${environment.apiUrl}${path}`, {
        params: params,
        headers: this.headers,
      })
      .pipe(catchError(this.formatErrors)) as Observable<T>;
  }

  patch<T>(
    path: string,
    body: object = {},
    headers: HttpHeaders = new HttpHeaders()
  ): Observable<T> {
    if (headers['lazyUpdate']) {
      this.headers = headers;
    }

    return this.http
      .patch<T>(`${environment.apiUrl}${path}`, JSON.stringify(body), {
        headers: this.headers,
      })
      .pipe(catchError(this.formatErrors));
  }

  post<T>(
    path: string,
    body: object = {},
    headers: HttpHeaders = new HttpHeaders()
  ): Observable<T> {
    if (headers['lazyUpdate']) {
      this.headers = headers;
    }
    return this.http
      .post<T>(`${environment.apiUrl}${path}`, JSON.stringify(body), {
        headers: this.headers,
      })
      .pipe(catchError(this.formatErrors));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<T>(`${environment.apiUrl}${path}`)
      .pipe(catchError(this.formatErrors));
  }
}
