import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService, ConfigService, PlateformModel } from '../../services';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlateformGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const url = state.url.split('?')[0];
    const localPlateform = this.authService.getLocalPlateform();
    // let plateform: PlateformModel = localPlateform as PlateformModel;

    // if (url.includes('/b/banking') || url === '/b/banking') {
    //   plateform = 'onlineBanking';
    // } else if (url.includes('/m/market') || url === '/m/market') {
    //   plateform = 'marketPlace';
    // } else if (url.includes('/o/onamob') || url === '/o/onamob') {
    //   plateform = 'onamob';
    // } else if (url === '' || url === '/') {
    //   plateform = 'authentification';
    // }
    const plateformData = environment.plateformsUuid.find(env =>
      env.baseHref.includes(url)
    );
    if (localPlateform !== plateformData?.name) {
      this.configService.switchPlateform(
        plateformData?.name as PlateformModel,
        false
      );
    }
    return true;
  }
}
