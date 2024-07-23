import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { ApiService } from '..';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private _asideMenuStatus: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  get getAsideMenuStatus$(): Observable<boolean> {
    return this._asideMenuStatus.asObservable();
  }

  constructor(private apiService: ApiService) {}

  toggleAsideMenu(ForHidden?: boolean) {
    if (ForHidden === true) {
      this._asideMenuStatus.next(false);
    } else {
      this._asideMenuStatus.next(!this._asideMenuStatus.value);
    }
  }

  getMenu(group: string) {
    return this.apiService
      .get('/menugroup/list/?group_type=' + group)
      .pipe(map(data => data));
  }

  getMenuGroup(menu_id: string) {
    return this.apiService
      .get('/menu/list/?menu_group=' + menu_id)
      .pipe(map(data => data));
  }

  getAllMenu() {
    return this.apiService.get('/menugroup/list/').pipe(map(data => data));
  }

  getTypeMenuGroups() {
    return this.apiService
      .get('/type_menu_groups/list ')
      .pipe(map(data => data));
  }
}
