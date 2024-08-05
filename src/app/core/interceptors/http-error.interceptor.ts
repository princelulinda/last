import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  isAuthenticated = true;
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      // retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        // if (error.status === 401 || error.status === 403) {
        //     console.log('WRONG RESPONSE: LOGGING OUT USER... ');
        //     if (this.isAuthenticated) {
        //         this.store.dispatch(new Logout());
        //         this.router.navigate(['/']);
        //     } else {
        //         this.router.navigate(['/']);
        //     }
        // }

        console.error(errorMessage, '\nError Object:', error.error);
        return throwError(error);
      })
    );
  }
}
