import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export function clientInfoInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  //Get the subject
  let appSubject = req.headers.get('X-iHela-AppSubject');

  if (!appSubject) {
    appSubject = environment.defaultAppSubject;
  }

  // TODO : Get Access Client Id and Access Bank Id from indexeddb

  // Clone the request to add headers.
  const newReq = req.clone({
    headers: req.headers
      .set('X-iHela-Access-Client-Id', '')
      .set('X-iHela-Access-Bank-Id', '')
      .set('X-iHela-AppSubject', appSubject)
      .set('X-iHela-AppInfo', environment.appInfo),
  });
  return next(newReq);
}
