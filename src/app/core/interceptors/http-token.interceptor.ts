import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export function httpTokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(AuthService).getLocalAuthToken();

  // Clone the request to add the authentication header.
  if (
    authToken === null ||
    authToken === undefined ||
    authToken === '' ||
    authToken === 'undefined' ||
    authToken === 'null'
  ) {
    return next(req);
  } else {
    const newReq = req.clone({
      headers: req.headers.set('Authorization', `Token ${authToken}`),
    });
    return next(newReq);
  }
}
