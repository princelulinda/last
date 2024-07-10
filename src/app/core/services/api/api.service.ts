import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { PlateformModel } from '../config/config.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private localUserTokenKey = 'iHelaRyanjeUserToken';
  private localUserClientIdKey = 'iHelaRyanjeUserClientId';
  private localBankIdKey = 'iHelaRyanjeBankId';
  private localPlateformKey = 'iHelaRyanjePlaform';

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

  getLocalClientId(): string | null {
    const localClientId = localStorage.getItem(this.localUserClientIdKey);

    if (!localClientId) {
      localStorage.removeItem(this.localUserClientIdKey);
      return null;
    } else {
      return localClientId;
    }
  }

  setLocalClientId(cliendId: string) {
    localStorage.setItem(this.localUserClientIdKey, cliendId);
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

  getLocalPlateform(): PlateformModel {
    const plateform = localStorage.getItem(this.localPlateformKey);
    return plateform as PlateformModel;
  }

  setLocalPlateform(plateform: PlateformModel) {
    localStorage.setItem(this.localPlateformKey, plateform);
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

  patch(
    path: string,
    body: object = {},
    headers: HttpHeaders = new HttpHeaders()
  ): Observable<object> {
    if (headers['lazyUpdate']) {
      this.headers = headers;
    }

    return this.http
      .patch(`${environment.apiUrl}${path}`, JSON.stringify(body), {
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

    console.log(
      'CHECK POST : ',
      path,
      body,
      this.headers,
      ' OTHER : ',
      this.http
        .post(`${environment.apiUrl}${path}`, JSON.stringify(body), {
          headers: this.headers,
        })
        .pipe(catchError(this.formatErrors))
    );

    return this.http
      .post<T>(`${environment.apiUrl}${path}`, JSON.stringify(body), {
        headers: this.headers,
      })
      .pipe(catchError(this.formatErrors));
  }

  delete(path: string): Observable<object> {
    return this.http
      .delete(`${environment.apiUrl}${path}`)
      .pipe(catchError(this.formatErrors));
  }
}
