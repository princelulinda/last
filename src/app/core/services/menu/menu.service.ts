import { Injectable, signal, WritableSignal } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ApiService, ConfigService, DialogService, GeneralService } from '..';
import {
  MenuGroupAndMenusSimpleModel,
  MenuSimpleModel,
  TypeMenuModel,
  TypeMenuNamesModel,
  URLTypeMenuModel,
} from '../../db/models/menu/menu.models';
import { PaginationConfig } from '../../../global/models/pagination.models';
import { PageMenusModel } from '../../../components/admin/menu/menu.models';
import { toObservable } from '@angular/core/rxjs-interop';
import { AccessModel } from '../../../components/admin/access/access.models';
import { MetadataModel } from '../../../components/metadatas/metadata.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private pageMenus: WritableSignal<PageMenusModel[]> = signal([]);

  constructor(
    private apiService: ApiService,
    private generalService: GeneralService,
    private dialogService: DialogService,
    private configService: ConfigService,
    private router: Router
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

  getAccesses(
    redirectTo: string,
    activateRedirect = true
  ): Observable<{ objects: AccessModel[]; count: number }> {
    this.dialogService.dispatchLoading('topLoader');
    this.configService.clearActiveAccesses();
    const url = `/hr/access/acl/roles/`;
    return this.apiService
      .get<{ objects: AccessModel[]; count: number }>(url)
      .pipe(
        map(data => {
          this.manageAccesses(data.objects, redirectTo, activateRedirect);
          return data;
        })
      );
  }

  private manageAccesses(
    data: AccessModel[],
    redirectTo: string,
    activateRedirect: boolean
  ) {
    this.configService.setActiveAccesses(data);
    this.dialogService.closeLoading();
    if (activateRedirect) {
      this.router.navigate([redirectTo]);
    }
  }

  getMenuGroupByActivateRoute(
    menus: TypeMenuModel[],
    typeMenu: URLTypeMenuModel,
    signature: string
  ): MenuGroupAndMenusSimpleModel | null | undefined {
    let menuGroups: MenuGroupAndMenusSimpleModel[] = [];
    let selectedGroup: MenuGroupAndMenusSimpleModel | null = null;

    [menuGroups] = this.getActiveMenuGroups(menus, typeMenu);

    if (signature && menuGroups) {
      // TODO :: TO REMOVE AFTER
      for (const group of menuGroups) {
        for (const menu of group.menus) {
          if (menu.name == 'Operators') {
            menu.signature = '30410983 hello operator';
          }

          if (menu.name == 'Clients') {
            menu.signature = '1234 salut client';
          }
        }
      }

      selectedGroup =
        menuGroups.find(group =>
          group.menus.find(menu => menu.signature === signature.trim())
        ) ?? null;

      // NOTE :: SELECTED MENU ONLY
      if (selectedGroup) {
        selectedGroup.menus = selectedGroup?.menus.filter(
          menu => menu.signature === signature.trim()
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

  getBankingMenu(
    typeMenu: 'banking' | 'market',
    type: 'Aside-Menu' | 'Dashboard',
    menus: TypeMenuModel[]
  ): [MenuSimpleModel[] | [], string] {
    let selectedGroup: MenuSimpleModel[] = [];
    let menuGroups: MenuGroupAndMenusSimpleModel[] = [];

    switch (typeMenu) {
      case 'banking':
        if (menus) {
          menuGroups = this.getMenuGroupByType('Banking', menus);
        }
        if (menuGroups) {
          if (type === 'Aside-Menu') {
            selectedGroup =
              menuGroups.find(group => group.name === 'BankingHub')?.menus ??
              [];
          } else {
            selectedGroup =
              menuGroups.find(group => group.name === 'Banking services')
                ?.menus ?? [];
          }
        }
        return [selectedGroup, '/w/workstation/b/banking/'];
        break;

      case 'market':
        if (menus) {
          menuGroups = this.getMenuGroupByType('Market', menus);
        }
        if (menuGroups) {
          if (type === 'Aside-Menu') {
            selectedGroup =
              menuGroups.find(group => group.name === 'Merchant Reports')
                ?.menus ?? [];
          } else {
            selectedGroup =
              menuGroups.find(group => group.name === 'My Market')?.menus ?? [];
          }
        }
        return [selectedGroup, '/w/workstation/m/market/'];
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

  setSelectedMenu(
    menu: MenuSimpleModel,
    url: string,
    event?: MouseEvent,
    enableRedirection?: boolean
  ): MenuSimpleModel {
    if (event) {
      event.preventDefault();
    }

    this.setLocalSelectedMenu(menu.id);
    // NOTE :: GETTING ACCESS MENUS
    this.getAccesses(url, enableRedirection);
    return menu;
  }
}
