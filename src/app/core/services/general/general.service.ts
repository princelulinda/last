import { Injectable } from '@angular/core';
import { ApiService } from '..';
import { map, Observable, Subject, switchMap, takeUntil } from 'rxjs';

import { MobileBanksModel } from '../../../components/dev/global-mapping/glob-mapping.model';
import { ParamModel } from '../../../global/components/reusable-list/reusable.model';
import { getdataModal } from '../../../global/components/reusable-list/reusable.model';
import { PaginationModel } from '../../../global/models/pagination.models';
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
    pagination: PaginationModel = { filters: { limit: 0, offset: 0 } },
    params: ParamModel[] = []
  ): Observable<getdataModal> {
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

  // getOverviewData(url: string) {
  //   return this.apiService.get(url).pipe(map(data => data));
  // }

  // createDocument(body: any) {
  //   const headers = new HttpHeaders().set(
  //     'Content-Type',
  //     'multipart/form-data'
  //   );
  //   console.log('service body', body);
  //   return this.apiService
  //     .post('/edms/documents/', body, headers)
  //     .pipe(map(data => data));
  // }

  // //onlineBanking

  // getMobileLookup(body: any) {
  //   const url = `/banks/clientlookup/`;
  //   return this.apiService.post(url, body).pipe(map(data => data));
  // }
  // pingMerchant(merchantId: string) {
  //   return this.apiService
  //     .get('/dbs/partner/ping/?ping_type=merchant&ping_data=' + merchantId)
  //     .pipe(map(data => data));
  // }

  // deepEqual(obj1: any, obj2: any) {
  //   // Base case: If both objects are identical, return true.
  //   if (obj1 === obj2) {
  //     return true;
  //   }
  //   // Check if both objects are objects and not null.
  //   if (
  //     typeof obj1 !== 'object' ||
  //     typeof obj2 !== 'object' ||
  //     obj1 === null ||
  //     obj2 === null
  //   ) {
  //     return false;
  //   }
  //   // Get the keys of both objects.
  //   const keys1 = Object.keys(obj1);
  //   const keys2 = Object.keys(obj2);
  //   // Check if the number of keys is the same.
  //   if (keys1.length !== keys2.length) {
  //     return false;
  //   }
  //   // Iterate through the keys and compare their values recursively.
  //   for (const key of keys1) {
  //     if (!keys2.includes(key) || this.deepEqual(obj1[key], obj2[key])) {
  //       return false;
  //     }
  //   }
  //   // If all checks pass, the objects are deep equal.
  //   return true;
  // }

  // isCurrentDateInChristMassPeriod() {
  //   // Get the current date
  //   const currentDate = new Date();
  //   // Get the month and date of the current date
  //   const currentMonth = currentDate.getMonth(); // 0 for January, 11 for December
  //   const currentDateDate = currentDate.getDate();
  //   // Check if the current date is between 15 December and 5 January
  //   return (
  //     (currentMonth == 11 && currentDateDate >= 15) ||
  //     (currentMonth == 0 && currentDateDate <= 5)
  //   );
  // }

  // mappAccount(body: any) {
  //   const url = `/mappaccount/create/?request_type=ident`;
  //   return this.apiService.post(url, body).pipe(map(data => data));
  // }

  // // this a sensive string comparisons, that algorithme is from fast-levenshtein package

  // levenshteinDistance(str1: any, str2: any) {
  //   const n = str1.length;
  //   const m = str2.length;
  //   const dp: any = [];

  //   // Initialize DP table
  //   for (let i = 0; i <= n; i++) {
  //     dp[i] = [];
  //     for (let j = 0; j <= m; j++) {
  //       dp[i][j] = i === 0 ? j : j === 0 ? i : Infinity;
  //     }
  //   }

  //   // Calculate distances
  //   for (let i = 1; i <= n; i++) {
  //     for (let j = 1; j <= m; j++) {
  //       const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
  //       dp[i][j] = Math.min(
  //         dp[i - 1][j] + 1, // deletion
  //         dp[i][j - 1] + 1, // insertion
  //         dp[i - 1][j - 1] + cost // substitution
  //       );
  //     }
  //   }

  //   return dp[n][m];
  // }

  // // for finding a string with most similarity

  // findMostSimilar(list: any, string: any) {
  //   return list.reduce((bestMatch: any, element: any) => {
  //     const currentDistance = this.levenshteinDistance(element, string);
  //     const bestDistance = this.levenshteinDistance(bestMatch, string);
  //     return currentDistance < bestDistance ? element : bestMatch;
  //   }, '');
  // }

  // verifyPin(body: object) {
  //   const url = `/client/verify-pin/`;
  //   return this.apiService.post(url, body).pipe(map(data => data));
  // }

  getMobileBanks(): Observable<{ objects: MobileBanksModel[] }> {
    const url = `/banks/list/?bank_type=MOB&is_mappable=true`;
    return this.apiService.get<{ objects: MobileBanksModel[] }>(url);
  }
}
