import { Injectable, signal, WritableSignal } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ApiService } from '..';
import {
  MenuGroupAndMenusSimpleModel,
  MenuGroupsModel,
  MenuModel,
  TypeMenuModel,
  TypeMenuNamesModel,
  URLTypeMenuModel,
} from '../../db/models/menu/menu.models';
import { PaginationConfig } from '../../../global/models/pagination.models';
import { PageMenusModel } from '../../../components/admin/menu/menu.models';
import { toObservable } from '@angular/core/rxjs-interop';
import { AccessModel } from '../../../components/admin/access/access.models';
import { Router } from '@angular/router';

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

  getMetadata(search = '', pagination?: PaginationConfig) {
    const url = `/metadata/?search=${search}&limit=${pagination?.filters.limit}&offset=${pagination?.filters.offset}`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  getAccesses(): Observable<{ objects: AccessModel[]; count: number }> {
    const url = `/hr/access/acl/roles/`;
    return this.apiService
      .get<{ objects: AccessModel[]; count: number }>(url)
      .pipe(map(data => data));
  }

  getMenuByActivateRoute(
    menus: TypeMenuModel[],
    typeMenu: URLTypeMenuModel,
    router: Router
  ): MenuGroupAndMenusSimpleModel | null | undefined {
    let pathname = window.location.pathname;
    //NOTE:: just for removing language prefixes in case i18n is activated
    if (['en', 'fr'].includes(pathname.split('/')[1])) {
      pathname = pathname.slice(3);
    }
    let menuGroups: MenuGroupAndMenusSimpleModel[] = [];
    let baseMenuUrl = '';
    let selectedGroup: MenuGroupAndMenusSimpleModel | null = null;

    [menuGroups, baseMenuUrl] = this.getActiveMenuGroups(menus, typeMenu);

    console.log('BASE MENU URL', baseMenuUrl, baseMenuUrl.split('/').length);

    if (
      menuGroups &&
      baseMenuUrl.split('/').length > 6 &&
      router.config.some(route => route.path === pathname)
    ) {
      selectedGroup =
        menuGroups.find(group =>
          group.menus.find(
            menu => `${baseMenuUrl}${menu.component_url}` === pathname
          )
        ) ?? null;

      if (selectedGroup) {
        selectedGroup.menus = selectedGroup?.menus.filter(
          menu => `${baseMenuUrl}${menu.component_url}` === pathname
        );
      }
      return selectedGroup;
    } else {
      return undefined;
    }
  }

  getActiveMenuGroups(
    menus: TypeMenuModel[],
    typeMenu: URLTypeMenuModel
  ): [MenuGroupAndMenusSimpleModel[] | [], string] {
    switch (typeMenu) {
      case 'a':
        return [this.getMenuGroupByType('Admin', menus), '/w/workstation/a/'];
        break;
      case 'd':
        return [
          this.getMenuGroupByType('Desk', menus),
          '/w/workstation/d/desk/',
        ];
        break;
      case 'i':
        return [
          this.getMenuGroupByType('Intranet', menus),
          '/w/workstation/i/intranet/',
        ];
        break;
      case 'r':
        return [
          this.getMenuGroupByType('Reporting', menus),
          '/w/workstation/r/reporting/',
        ];
        break;
      default:
        return [[], '/w/workstation/'];
        break;
    }
  }

  private getMenuGroupByType(
    type: TypeMenuNamesModel,
    menus: TypeMenuModel[]
  ): MenuGroupAndMenusSimpleModel[] {
    return menus.find(typeMenu => typeMenu.name === type)
      ?.menu_groups as MenuGroupAndMenusSimpleModel[];
  }
}
