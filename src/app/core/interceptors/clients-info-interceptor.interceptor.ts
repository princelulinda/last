import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Injectable()
export class ClientsInfoInterceptorInterceptor implements HttpInterceptor {
  constructor(
    private store: Store,
    @Inject(LOCALE_ID) protected localeId: string
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const headersConfig: {
      'X-iHela-Access-Client-Id': string;
      'X-iHela-Access-Bank-Id': string;
      'X-iHela-AppSubject': string;
    } = {
      'X-iHela-Access-Client-Id': '',
      'X-iHela-Access-Bank-Id': '',
      'X-iHela-AppSubject': '',
    };

    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request);
  }
}
