import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export function clientInfoInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  // Clone the request to add headers.
  const newReq = req.clone({
    headers: req.headers
      .set('X-iHela-Access-Client-Id', '')
      .set('X-iHela-Access-Bank-Id', '')
      .set('X-iHela-AppSubject', '')
      .set('X-iHela-AppInfo', environment.appInfo),
  });
  return next(newReq);
}
