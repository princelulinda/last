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
import { AccessModel } from '../../../components/admin/access/access.models';
import { MetadataModel } from '../../../components/metadatas/metadata.model';

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

  getLocalSelectedMenu(): string | null {
    return this.apiService.getLocalSelectedMenu();
  }

  setLocalSelectedMenu(menu: number) {
    this.apiService.setLocalSelectedMenu(menu);
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

  getMetadata(search = '', pagination?: PaginationConfig): Observable<{ objects: MetadataModel[]; count: number }> {
    const url = `/metadata/?search=${search}&limit=${pagination?.filters.limit}&offset=${pagination?.filters.offset}`;
    return this.apiService.get(url).pipe(map(data => data as { objects: MetadataModel[]; count: number }));
  }

  getAccesses(): Observable<{ objects: AccessModel[]; count: number }> {
    const url = `/hr/access/acl/roles/`;
    return this.apiService
      .get<{ objects: AccessModel[]; count: number }>(url)
      .pipe(map(data => data));
  }
}
