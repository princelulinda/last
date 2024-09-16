import { Injectable, signal, WritableSignal } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ApiService } from '..';
import {
  MenuGroupsModel,
  MenuModel,
  TypeMenuModel,
} from '../../db/models/menu/menu.models';
import { PaginationConfig } from '../../../global/models/pagination.models';
import { PageMenusModel } from '../../../components/admin/menu/menu.models';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private pageMenus: WritableSignal<PageMenusModel[]> = signal([]);

  constructor(private apiService: ApiService) {}

  setPageMenus(menus: PageMenusModel[]) {
    this.pageMenus.set(menus);
  }

  getPageMenus(): Observable<PageMenusModel[]> {
    return toObservable(this.pageMenus);
  }

  destroyPageMenus(): void {
    this.pageMenus.set([]);
  }

  getMenuGroupByGroup(type: string) {
    return this.apiService
      .get('/menugroup/list/?group_type=' + type)
      .pipe(map(data => data));
  }

  getAllMenuGroup(): Observable<{ objects: MenuGroupsModel[]; count: number }> {
    return this.apiService
      .get<{ objects: MenuGroupsModel[]; count: number }>('/menu-group/list/')
      .pipe(map(data => data));
  }

  getMenuByGroup(
    menu_group_id: string
  ): Observable<{ objects: MenuModel[]; count: number }> {
    return this.apiService
      .get<{
        objects: MenuModel[];
        count: number;
      }>('/menu/list/?menu_group=' + menu_group_id)
      .pipe(map(data => data));
  }

  getTypeMenuGroups(): Observable<{ objects: TypeMenuModel[]; count: number }> {
    return this.apiService
      .get<{ objects: TypeMenuModel[]; count: number }>('/type_menugroup/list/')
      .pipe(map(data => data));
  }

  getMetadata(search = '', pagination?: PaginationConfig) {
    const url = `/metadata/?search=${search}&limit=${pagination?.filters.limit}&offset=${pagination?.filters.offset}`;
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
}
