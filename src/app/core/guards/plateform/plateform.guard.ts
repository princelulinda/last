import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService, ConfigService } from '../../services';
import { PlateformModel } from '../../services/config/main-config.models';

@Injectable({
  providedIn: 'root',
})
export class PlateformGuard {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {}
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const routePlateform: PlateformModel = route.data['plateform'];
    const localPlateform = this.authService.getLocalPlateform();

    if (routePlateform !== localPlateform) {
      this.configService.switchPlateform(routePlateform);
    }

    return true;
  }
}
