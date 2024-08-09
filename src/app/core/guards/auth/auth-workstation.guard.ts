import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { FullpathService } from '../../services/config/fullpath.service';
import { ConfigService } from '../../services';

@Injectable({
  providedIn: 'root',
})
export class AuthWorkstationGuard {
  constructor(
    private fullpathService: FullpathService,
    private router: Router,
    private configService: ConfigService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const operatorAuthenticated =
      this.configService.getLocalConnectedOperator();
    if (operatorAuthenticated) {
      return true;
    } else {
      const currentUrl = this.fullpathService.getFullPath(route);
      this.router.navigate(['/auth/corporate'], {
        queryParams: { next: currentUrl },
      });

      return false;
    }
  }
}
