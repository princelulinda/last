import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .append('Accept', 'application/json');

  constructor(private http: HttpClient) {}

  private formatErrors(error: string) {
    return throwError(error);
  }

  get(
    path: string,
    params: HttpParams = new HttpParams(),
    headers: HttpHeaders = new HttpHeaders()
  ): Observable<object> {
    if (headers['lazyUpdate']) {
      this.headers = headers;
    }

    return this.http
      .get(`${environment.apiUrl}${path}`, {
        params: params,
        headers: this.headers,
      })
      .pipe(catchError(this.formatErrors));
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

  post(
    path: string,
    body: object = {},
    headers: HttpHeaders = new HttpHeaders()
  ): Observable<object> {
    if (headers['lazyUpdate']) {
      this.headers = headers;
    }

    return this.http
      .post(`${environment.apiUrl}${path}`, JSON.stringify(body), {
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
