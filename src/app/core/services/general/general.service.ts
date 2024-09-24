import { Injectable } from '@angular/core';

import { map, Observable, Subject, switchMap, takeUntil } from 'rxjs';

import { ApiService } from '..';
import {
  MappingBody,
  MappingResponseModel,
  MobileBanksModel,
} from '../../../global/components/global-mapping/glob-mapping.model';
import { ParamModel } from '../../../global/components/list/reusable-list/reusable.model';
import { getdataModel } from '../../../global/components/list/reusable-list/reusable.model';
import { PaginationConfig } from '../../../global/models/pagination.models';
import {
  MetadataBodyModel,
  MetadataCreationResponseModel,
  MetadataModel,
} from '../../../components/metadatas/metadata.model';
import { OverviewModel } from '../../../global/components/list/list/list.model';
import { confirmDialogModel } from '../../../global/components/popups/confirm-dialog/confirm-dialog.model';
import { AccessModel } from '../../../components/admin/access/access.models';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private cancelPreviousRequest$ = new Subject<void>();
  private inputChanged$ = new Subject<string>();

  constructor(private apiService: ApiService) {}
  getData(
    url: string,
    pagination: PaginationConfig,
    params: ParamModel[] = []
  ): Observable<getdataModel> {
    let paginationString = '';
    let paramsString = '';

    if (pagination.filters) {
      paginationString =
        'limit=' +
        pagination.filters.limit +
        '&offset=' +
        pagination.filters.offset;
    }

    if (params.length > 0) {
      paramsString = params
        .map(param => `${param.title}=${param.value}`)
        .join('&');
    }

    const queryString = `${paginationString}${paginationString && paramsString ? '&' : ''}${paramsString}`;
    return this.apiService.get(`${url}${queryString}`);
  }

  DoAutocomplete(url: string, search: string) {
    this.inputChanged$.next(search);

    return this.inputChanged$.pipe(
      switchMap(newSearch => {
        this.cancelPreviousRequest$.next();

        return this.apiService
          .get(url + newSearch)
          .pipe(takeUntil(this.cancelPreviousRequest$));
      })
    );
  }

  DoLookup(url = '', search = '') {
    return this.apiService.get(url + search).pipe(map(data => data));
  }

  getMobileBanks(): Observable<{ objects: MobileBanksModel[] }> {
    const url = `/banks/list/?bank_type=MOB&is_mappable=true`;
    return this.apiService.get<{ objects: MobileBanksModel[] }>(url);
  }

  getWorkstationStats() {
    const url =
      '/dbs/general/stats/?stats_type=agents_number,merchants_number,clients_created';
    return this.apiService.get(url).pipe(map(data => data));
  }

  mappAccount(body: MappingBody): Observable<MappingResponseModel> {
    const url = `/mappaccount/create/?request_type=ident`;
    return this.apiService
      .post(url, body)
      .pipe(map(response => response as MappingResponseModel));
  }

  getMetadata(
    search = '',
    pagination?: PaginationConfig
  ): Observable<{
    count: number;
    objects: MetadataModel[];
  }> {
    const url = `/metadata/?search=${search}&limit=${pagination?.filters.limit}&offset=${pagination?.filters.offset}`;
    return this.apiService
      .get<{ count: number; objects: MetadataModel[] }>(url)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  createMetadata(
    body: MetadataBodyModel
  ): Observable<MetadataCreationResponseModel> {
    const url = '/metadata/';
    return this.apiService
      .post(url, body)
      .pipe(map(response => response as MetadataCreationResponseModel));
  }

  getOverviewData(
    url: string
  ): Observable<{ object: OverviewModel[]; count: number }> {
    return this.apiService
      .get<{ object: OverviewModel[]; count: number }>(url)
      .pipe(map(data => data));
  }

  changePin(body: object): Observable<confirmDialogModel> {
    const url = '/client/change-pin/';
    return this.apiService
      .post(url, body)
      .pipe(map(response => response as confirmDialogModel));
  }

  //NOTE :: This a sensive string comparisons, that algorithme is from fast-levenshtein package
  private levenshteinDistance(str1: string, str2: string) {
    const n = str1.length;
    const m = str2.length;
    const dp: string | number[][] = [];

    // Initialize DP table
    for (let i = 0; i <= n; i++) {
      dp[i] = [];
      for (let j = 0; j <= m; j++) {
        dp[i][j] = i === 0 ? j : j === 0 ? i : Infinity;
      }
    }

    //NOTE ::  Calculate distances
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return dp[n][m];
  }

  // NOTE :: for finding a string with most similarity
  findMostSimilar(list: string[], searchElement: string) {
    console.log('MENU TO CHECK', list);
    return list.reduce((bestMatch: string, element: string) => {
      const currentDistance = this.levenshteinDistance(element, searchElement);
      const bestDistance = this.levenshteinDistance(bestMatch, searchElement);
      return currentDistance < bestDistance ? element : bestMatch;
    }, '');
  }

  getAccess(): AccessModel[] | [] {
    // const pathname = window.location.pathname;
    // const empty = [];
    const subMenus: { component_url: string; id: number; name: string }[] = [];

    // this.subMenus$.subscribe({
    //   next: subMenus => {
    let pathname = window.location.pathname;

    //NOTE:: just for removing language prefixes in case i18n is activated
    if (['en', 'fr'].includes(pathname.split('/')[1])) {
      pathname = pathname.slice(3);
    }

    if (subMenus && subMenus.length > 0) {
      // const subMenuSimularToPathname = this.findMostSimilar(
      //   subMenus.map(submenus => submenus.component_url),
      //   pathname
      // );
      // const subMenuId: number = subMenus.find(
      //   subMenu => subMenu.component_url === subMenuSimularToPathname
      // ).id;
      // if (subMenuId) {
      //   this.getSubMenu(subMenuId).subscribe({
      //     next: (subMenus: any) => {
      //       return subMenus.objects;
      //     },
      //   });
      // } else {
      //   return empty;
      // }
      return [];
    } else {
      return [];
    }
    // },
    // });
  }
}
