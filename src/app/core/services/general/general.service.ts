import { Injectable } from '@angular/core';
import { ApiService } from '..';
import { map, Observable, Subject, switchMap, takeUntil } from 'rxjs';

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
// import { HttpHeaders } from '@angular/common/http';

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

  //   changePin(body:object) {
  //     const url = '/client/change-pin/';
  //     return this.apiService.post(url, body).pipe(
  //         map((data: any) => {
  //             return data;
  //         })
  //     );
  // }
  changePin(body: object): Observable<confirmDialogModel> {
    const url = '/client/change-pin/';
    return this.apiService
      .post(url, body)
      .pipe(map(response => response as confirmDialogModel));
  }
}
