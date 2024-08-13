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
}
