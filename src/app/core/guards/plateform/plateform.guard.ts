import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService, ConfigService, FullpathService } from '../../services';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { PlateformModel } from '../../services/config/main-config.models';

@Injectable({
  providedIn: 'root',
})
export class PlateformGuard {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router,
    private fullpathService: FullpathService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // const url = route.url.toString();
    const url = state.url + '/';

    const localPlateform = this.authService.getLocalPlateform();

    const plateformData = environment.plateformsUuid.filter(env => {
      if (env.baseHref !== '/') {
        if (url.startsWith(env.baseHref) && url.length >= env.baseHref.length) {
          return env;
        } else {
          return [];
        }
      } else {
        return env;
      }
    })[0];
    console.log('PLATEFORM DATA', plateformData, url);

    if (plateformData && localPlateform !== plateformData?.name) {
      this.configService.switchPlateform(
        plateformData?.name as PlateformModel,
        false
      );
    }
    return true;
  }
}
