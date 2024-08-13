import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class FullpathService {
  public loginUrl = '/login/';
  public nextDefaultUrl = '/b/banking';

  constructor(private configService: ConfigService) {}

  getFullPath(snapshot: ActivatedRouteSnapshot): string {
    let path = snapshot.url.map(segment => segment.path).join('/');
    if (snapshot.firstChild) {
      path += '/' + this.getFullPath(snapshot.firstChild);
    }
    return path;
  }

  getBaseRouterLink(): string {
    let url = '';
    this.configService.getPlateform().subscribe({
      next: plateform => {
        if (plateform !== 'authentification') {
          switch (plateform) {
            case 'marketPlace':
              url = '/m/market';
              break;
            case 'myMarket':
              url = '/m/mymarket';
              break;
            case 'onlineBanking':
              url = '/b/banking';
              break;
            case 'workstation':
              url = '/w/workstation/';
              break;
          }
        }
      },
    });
    return url;
  }
}
