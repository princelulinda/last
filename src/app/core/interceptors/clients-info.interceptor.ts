import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService, MenuService } from '../services';

export function clientInfoInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const menuService = inject(MenuService);

  const BANK_ID = authService.getLocalBankId();
  const PLATEFORM = authService.getLocalPlateform();
  const MENU_ID = menuService.getLocalSelectedMenu();

  let appSubject = '';
  const plateformData = environment.plateformsUuid.filter(
    plateformData => plateformData.name === PLATEFORM
  )[0];

  if (!plateformData) {
    appSubject = environment.defaultAppSubject;
  } else {
    appSubject = plateformData.uuid;
  }

  // TODO : Get Access Client Id and Access Bank Id from indexeddb

  // Clone the request to add headers.
  const newReq = req.clone({
    headers: req.headers
      .set('X-iHela-Access-Bank-Id', BANK_ID ?? '')
      .set('X-iHela-AppSubject', appSubject)
      .set('X-iHela-AppInfo', environment.appInfo)
      .set('X-iHela-Active-Menu-Id', MENU_ID ?? ''),
  });
  return next(newReq);
}
