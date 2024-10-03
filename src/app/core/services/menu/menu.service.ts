import { Injectable, signal, WritableSignal } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ApiService, GeneralService } from '..';
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
import { MetadataModel } from '../../../components/metadatas/metadata.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private pageMenus: WritableSignal<PageMenusModel[]> = signal([]);

  constructor(
    private apiService: ApiService,
    private generalService: GeneralService
  ) {}

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

  getMetadata(
    search = '',
    pagination?: PaginationConfig
  ): Observable<{ objects: MetadataModel[]; count: number }> {
    const url = `/metadata/?search=${search}&limit=${pagination?.filters.limit}&offset=${pagination?.filters.offset}`;
    return this.apiService
      .get(url)
      .pipe(map(data => data as { objects: MetadataModel[]; count: number }));
  }

  getAccesses(): Observable<{ objects: AccessModel[]; count: number }> {
    const url = `/hr/access/acl/roles/`;
    return this.apiService
      .get<{ objects: AccessModel[]; count: number }>(url)
      .pipe(map(data => data));
  }

  getMenuByActivateRoute(
    menus: TypeMenuModel[],
    typeMenu: URLTypeMenuModel
  ): MenuGroupAndMenusSimpleModel | null | undefined {
    let pathname = window.location.pathname;

    pathname = this.extractBasePath(pathname);

    let menuGroups: MenuGroupAndMenusSimpleModel[] = [];
    let baseMenuUrl = '';
    let selectedGroup: MenuGroupAndMenusSimpleModel | null = null;

    [menuGroups, baseMenuUrl] = this.getActiveMenuGroups(menus, typeMenu);

    if (menuGroups && baseMenuUrl.split('/').length > 4) {
      const componentUrls: string[] = [];

      menuGroups.map(group =>
        group.menus.map(menu => componentUrls.push(menu.component_url))
      );

      // NOTE :: GET MOST SIMILAR MENU BY COMPONENT URL
      const matchComponentUrl: string = this.generalService.findMostSimilar(
        componentUrls,
        pathname
      );

      selectedGroup =
        menuGroups.find(group =>
          group.menus.find(menu => menu.component_url === matchComponentUrl)
        ) ?? null;

      // NOTE :: SELECTED MENU ONLY
      if (selectedGroup) {
        selectedGroup.menus = selectedGroup?.menus.filter(
          menu => menu.component_url === matchComponentUrl
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

  private extractBasePath(pathName: string): string {
    const parts: string[] = pathName.split('/');

    //NOTE:: just for removing language prefixes in case i18n is activated
    if (['en', 'fr'].includes(parts[1])) {
      pathName = pathName.slice(3);
    }

    for (let i = 0; i < parts.length; i++) {
      if (Number(parts[i])) {
        return parts.slice(0, i).join('/');
      }
    }
    return pathName;
  }
}
