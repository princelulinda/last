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
    const plateformData = environment.plateformsUuid.find(env =>
      env.baseHref.includes(url)
    );
    alert(plateformData?.name);
    const localPlateform = this.authService.getLocalPlateform();
    if (localPlateform !== plateformData?.name) {
      this.configService.switchPlateform(plateformData?.name as PlateformModel);
    }
    return true;
  }
}
