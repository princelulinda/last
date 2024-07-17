import { Inject, Injectable } from '@angular/core';
// import { ApiService } from '..';
// import { GeneralSe } from '..';
// import { map, retry } from 'rxjs';

import { ApiService } from '../api/api.service';
import { map, Observable, retry } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MerchantLookup } from '../../../components/dashboards/dashboard.model';
import { Favorite, Pagination } from './model';
import {
  AllProductModel,
  MerchantInfoModel,
  MerchantObjectModel,
  MerchantObjectsModel,
} from '../../../components/products/products.model';
// import { Pagination } from './model';
@Injectable({
  providedIn: 'root',
})
export class MerchantService {
  constructor(
    @Inject(ApiService) private apiService: ApiService,
    @Inject(HttpClient) private http: HttpClient
  ) {}
  getMerchantList() {
    return this.apiService.get('/dbs/merchant/list/?').pipe(
      map(data => {
        return data;
      })
    );
  }
  // private _coords: BehaviorSubject<any> = new BehaviorSubject<[] | null>(null);
  // get coords$(): Observable<[]> {
  //     return this._coords.asObservable();
  // }
  // getUserCoords(coords: string) {
  //     this._coords.next(coords);
  //     console.log('coords', coords);
  // }
  // getMerchants(data: any) {
  //     const url = `/dbs/merchant/manage/?limit=${data.limit}&offset=${data.offset}`;
  //     return this.apiService.get(url).pipe(
  //         // retry({ count: 5, delay: 3000, resetOnSuccess: true }),
  //         map((data) => {
  //             return data;
  //         })
  //     );
  // }
  getMerchantsAutocomplete(search: string) {
    const url =
      '/dbs/merchant/manage/objects_autocomplete/?search=' +
      search +
      '&is_recent=true';
    return this.apiService.get(url).pipe(
      retry({ count: 5, delay: 3000, resetOnSuccess: true }),
      map(data => {
        return data;
      })
    );
  }
  //needed in market-dashboard
  getFavoriteMerchantsAutocomplete(search: string) {
    const url =
      '/dbs/merchant/manage/objects_autocomplete/?search=' +
      search +
      '&is_favorite=true';
    return this.apiService.get(url).pipe(
      retry({ count: 5, delay: 3000, resetOnSuccess: true }),
      map(data => {
        return data;
      })
    );
  }
  //needed in market-dashboard
  makeFavoriteMerchants(favorite: Favorite) {
    const url = '/dbs/merchant-client/favorite/';
    return this.apiService.post(url, favorite).pipe(
      retry({ count: 5, delay: 3000, resetOnSuccess: true }),
      map(data => {
        return data;
      })
    );
  }
  doBillAction(body: []) {
    const url = '/dbs/merchant/bill/action/perform/';
    return this.apiService.post(url, body).pipe(
      retry({ count: 5, delay: 3000, resetOnSuccess: true }),
      map(data => {
        return data;
      })
    );
  }
  getMerchantsDetails(id: string) {
    const url = '/dbs/merchant/manage/';
    return this.apiService.get(url + id).pipe(
      map(data => {
        return data;
      })
    );
  }
  getTopClientsByAmount(merchantId: string) {
    const url = `/dbs/merchant/top-clients/${merchantId}/?by_amount=true`;
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getTopClientsByTransactions(merchantId: string) {
    const url = `/dbs/merchant/top-clients/${merchantId}/?by_transaction=true`;
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getPaymentStats(merchantId: string) {
    const url = `/dbs/merchant/payment_stats/${merchantId}/`;
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  UpdateMerchantDetails(id: string, data: []) {
    const url = '/dbs/merchant/manage/';
    return this.apiService.patch(url + id + '/', data).pipe(
      map(data => {
        return data;
      })
    );
  }
  getMerchantsCategoriesDetails(id: string) {
    const url = '/dbs/merchant-category/';
    return this.apiService.get(url + id).pipe(
      map(data => {
        return data;
      })
    );
  }
  UpdateMerchantCategoriesDetails(id: string, data: []) {
    const url = '/dbs/merchant-category/';
    return this.apiService.patch(url + id, data).pipe(
      map(data => {
        return data;
      })
    );
  }
  getMerchantsBillsDetails(id: string) {
    const url = '/dbs/merchant/bills/';
    return this.apiService.get(url + id).pipe(
      map(data => {
        return data;
      })
    );
  }
  UpdateMerchantBillsDetails(id: string, data: []) {
    const url = '/dbs/merchant/bills/';
    return this.apiService.patch(url + id, data).pipe(
      map(data => {
        return data;
      })
    );
  }
  getMerchantsProductsDetails(id: string) {
    const url = '/dbs/merchant-product/' + id + '/';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getConnectedMerchantInfo() {
    const url = '/dbs/merchant/info/';
    return this.apiService.get<MerchantObjectModel>(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getMerchantInfos(merchantId: string) {
    const url = '/dbs/merchant/merchant-info/' + merchantId + '/';
    return this.apiService.get<MerchantInfoModel>(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getMerchantMultipleInfo() {
    const url = '/dbs/merchant/multiple-info/';
    return this.apiService.get<MerchantObjectsModel>(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  UpdateMerchantProductsDetails(id: string, data: []) {
    const url = '/dbs/merchant-product/';
    return this.apiService.patch(url + id, data).pipe(
      map(data => {
        return data;
      })
    );
  }
  UpdateMerchantTellersDetails(id: string, data: []) {
    return this.apiService.patch('/dbs/merchant-teller/' + id, data).pipe(
      map(data => {
        return data;
      })
    );
  }
  updateMerchantDetails(body: []) {
    return this.apiService.post('/dbs/merchant/configuration/', body).pipe(
      map(body => {
        return body;
      })
    );
  }
  getMerchantsCategories() {
    const url = '/dbs/merchant-category/';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getMerchantsTellers() {
    const url = '/dbs/merchant-teller/';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getMerchantsTellersDetails(id: string) {
    const url = '/dbs/merchant-teller/';
    return this.apiService.get(url + id).pipe(
      map(data => {
        return data;
      })
    );
  }
  getMerchantsBills() {
    const url = '/dbs/merchant/bills/';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getCLients() {
    const url = '/clients/list/all/objects_autocomplete?search=';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getMerchantsProducts() {
    const url = '/dbs/merchant-product/';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getProductsByMerchant(merchantId: string) {
    const url = '/dbs/merchant-product/?merchant=' + merchantId + '&';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  createNewTeller(body: []) {
    const url = '/dbs/merchant-teller/';
    return this.apiService.post(url, body).pipe(
      map(data => {
        return data;
      })
    );
  }
  createNewMerchant(body: []) {
    const url = '/dbs/merchant/creation/';
    return this.apiService.post(url, body).pipe(
      map(data => {
        return data;
      })
    );
  }
  createNewCategory(body: []) {
    const url = '/dbs/merchant-category/';
    return this.apiService.post(url, body).pipe(
      map(data => {
        return data;
      })
    );
  }
  createNewAgent(body: []) {
    const url = '/dbs/agent/bank/creation/';
    return this.apiService.post(url, body).pipe(
      map(data => {
        return data;
      })
    );
  }
  getActivitySectors() {
    const url = '/clients/config/activitysector/';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getCategoriesPerActivitySectors(id: string) {
    const url = '/dbs/merchant-category/?merchant_activity_sector=' + id;
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getMerchantsByCategory(categoryId: string) {
    const url = '/dbs/merchant/list/?category_id=' + categoryId;
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getMerchantProductLookup(lookupData: []) {
    const url = '/dbs/merchant/product/lookup/';
    return this.apiService.post(url, lookupData).pipe(
      map(data => {
        return data;
      })
    );
  }
  payMerchant(paymentData: []) {
    const url = '/dbs/merchant/product/payment/';
    return this.apiService.post(url, paymentData).pipe(
      map(data => {
        return data;
      })
    );
  }
  checkMerchantTitle(merchantName: string) {
    const apiUrl = `/dbs/merchant/verify-merchant-title/?merchant_title=${merchantName}`;
    return this.apiService.get(apiUrl).pipe(map(data => data));
  }
  checkTellerAlias(merchantId: string, merchantTellerName: string) {
    const apiUrl =
      '/dbs/merchant/verify-merchant-teller-alias/?merchant_id=' +
      merchantId +
      '&merchant_teller_alias=' +
      merchantTellerName +
      '';
    return this.apiService.get(apiUrl).pipe(map(data => data));
  }
  searchProduct(pagination: Pagination = {}, search = '') {
    let pagination_!: string;
    if (pagination.filters) {
      pagination_ =
        'limit=' +
        pagination.filters.limit +
        '&offset=' +
        pagination.filters.offset;
    }
    const url =
      '/dbs/merchant-product/objects_autocomplete/?' +
      pagination_ +
      '&search=' +
      search;
    return this.apiService.get<AllProductModel>(url).pipe(map(data => data));
  }
  //needed in market-dashboard
  getBIllers(biller: boolean) {
    const url = '/dbs/merchant/manage/objects_autocomplete/?is_biller=';
    return this.apiService.get(url + biller).pipe(map(data => data));
  }
  getBillActions(billId: string) {
    const url = `/dbs/merchant/bills/${billId}/object_actions/`;
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  merchantCashin(data: []) {
    const url = '/dbs/merchant/cashin/';
    return this.apiService.post(url, data).pipe(map(data => data));
  }
  getTellersByMerchant(merchantId: string) {
    const url = `/dbs/merchant-teller/?merchant=${merchantId}`;
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  doTellerAction(body: []) {
    const url = '/dbs/merchant-teller/teller/action/';
    return this.apiService.post(url, body).pipe(
      map(data => {
        return data;
      })
    );
  }
  getMerchantsByCategoriesSlug(
    slug: string
  ): Observable<{ objects: MerchantLookup[]; count: number }> {
    const url =
      '/dbs/merchant/manage/objects_autocomplete?category_slug=' + slug;
    return this.apiService
      .get<{ objects: MerchantLookup[]; count: number }>(url)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  updateProductInfo(body: []) {
    const url = '/dbs/merchant/product/configuration/';
    return this.apiService.post(url, body).pipe(
      map(data => {
        return data;
      })
    );
  }
  // searchProductByMerchant(data: any) {
  //     const url =
  //         '/dbs/merchant-product/objects_autocomplete/?merchant=' +
  //         data.merchant +
  //         '&search=' +
  //         data.search;
  //         console.log('the value of the data is :', data);
  //     return this.apiService.get(url).pipe(map((data) => data));

  // }

  /**********************api call of browse by category ******************************/
  getBrowseByCategory() {
    const url = '/dbs/merchant-product-category/';
    return this.apiService.get(url).pipe(map(data => data));
  }
  /******************************************************************************* */
  // searchTellersByMerchant(data: any) {
  //     const url =
  //         '/dbs/merchant-teller/objects_autocomplete/?merchant=' +
  //         data.merchant +
  //         '&search=' +
  //         data.search;
  //     return this.apiService.get(url).pipe(map((data) => data));
  // }
  getMerchantsLocation() {
    const url = '/dbs/merchant/maplist/';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
}
