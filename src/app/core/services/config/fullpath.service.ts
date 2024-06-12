import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FullpathService {
  public loginUrl = '/login/';
  public nextDefaultUrl = '/s/';

  getFullPath(snapshot: ActivatedRouteSnapshot): string {
    let path = snapshot.url.map(segment => segment.path).join('/');
    if (snapshot.firstChild) {
      path += '/' + this.getFullPath(snapshot.firstChild);
    }
    return path;
  }
}
