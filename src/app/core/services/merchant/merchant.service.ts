import { Injectable } from '@angular/core';

import { BehaviorSubject, map, Observable } from 'rxjs';

import { ApiService } from '../api/api.service';
import { MerchantLookup } from '../../../components/dashboards/dashboard.model';
import { DoMerchantTransferResponseModel } from '../../../components/merchant/merchant-transfer/merchant-transfer.models';
import { DoMerchantTransferModel } from '../../../components/merchant/merchant-transfer/merchant-transfer.models';
import {
  AllProductAutocompleteModel,
  updateProdcutInfoModel,
  addProductByMerchantModel,
  ObjectBillModel,
  paymentBillsModel,
  ProductFavoriteModel,
  ProductAutocompleteModel,
  ProductModel,
  ProductLookupBodyModel,
} from '../../../components/merchant/products/products.model';
import {
  doTellerBodyModel,
  MerchantAutocompleteModel,
  MerchantCategoriesModel,
  MerchantInfoModel,
  MerchantModel,
  MerchantStatsModel,
  newTellerModel,
  searchTellerModel,
  SectorActivityModel,
  updateMerchantDetailsModel,
} from '../../../components/merchant/merchant.models';
import { Coords2Model } from '../../../global/components/google-map/map.model';
import { PaginationConfig } from '../../../global/models/pagination.models';

@Injectable({
  providedIn: 'root',
})
export class MerchantService {
  constructor(private apiService: ApiService) {}

  private _coords: BehaviorSubject<Coords2Model> =
    new BehaviorSubject<Coords2Model>({
      accuracy: 0,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      latitude: 0,
      longitude: 0,
      speed: null,
    });

  get coords$(): Observable<Coords2Model> {
    return this._coords.asObservable();
  }

  private _connectedMerchantId: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  get connectedMerchantId$(): Observable<string> {
    return this._connectedMerchantId.asObservable();
  }

  getUserCoords(coords: Coords2Model) {
    this._coords.next(coords);
  }

  getMerchantList() {
    return this.apiService.get('/dbs/merchant/list/').pipe(map(data => data));
  }

  getRecentMerchantsAutocomplete(search?: string) {
    const url = `/dbs/merchant/manage/objects_autocomplete/?search=${search}&is_recent=true`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  getFavoriteMerchantsAutocomplete(search: string) {
    const url = `/dbs/merchant/manage/objects_autocomplete/?search='${search}&is_favorite=true`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  makeFavoriteMerchants(favorite: {
    merchant: string;
    merchant_action: string;
  }) {
    const url = '/dbs/merchant-client/favorite/';
    return this.apiService.post(url, favorite).pipe(map(data => data));
  }

  doBillAction(body: []) {
    const url = '/dbs/merchant/bill/action/perform/';
    return this.apiService.post(url, body).pipe(map(data => data));
  }

  getMerchantsDetails(id: number): Observable<{ object: MerchantModel }> {
    const url = `/dbs/merchant/manage/${id}/`;
    return this.apiService
      .get<{ object: MerchantModel }>(url)
      .pipe(map(data => data));
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

  getProductDetails(id: number): Observable<{ object: ProductModel }> {
    const url = `/dbs/merchant-product/${id}/`;
    return this.apiService
      .get<{ object: ProductModel }>(url)
      .pipe(map(data => data));
  }

  getConnectedMerchantInfo(): Observable<{ object: MerchantInfoModel }> {
    const url = '/dbs/merchant/info/';
    return this.apiService
      .get<{ object: MerchantInfoModel }>(url)
      .pipe(map(data => data));
  }

  getMerchantInfos(
    merchantId: string
  ): Observable<{ object: MerchantInfoModel }> {
    const url = '/dbs/merchant/merchant-info/' + merchantId + '/';
    return this.apiService
      .get<{ object: MerchantInfoModel }>(url)
      .pipe(map(data => data));
  }
  getMerchantMultipleInfo(): Observable<{
    objects: MerchantAutocompleteModel[];
    count: number;
  }> {
    const url = '/dbs/merchant/multiple-info/objects_autocomplete/';
    return this.apiService
      .get<{ objects: MerchantAutocompleteModel[]; count: number }>(url)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  UpdateMerchantProductsDetails(id: string, data: []) {
    const url = `/dbs/merchant-product/${id}/`;
    return this.apiService.patch(url, data).pipe(
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
  updateMerchantDetails(
    body: updateMerchantDetailsModel
  ): Observable<{ object: MerchantInfoModel }> {
    return this.apiService
      .post<{
        object: MerchantInfoModel;
      }>('/dbs/merchant/configuration/', body)
      .pipe(map(body => body));
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

  getMerchantProducts(
    merchantId: string,
    search?: string
  ): Observable<{ objects: ProductAutocompleteModel[]; count: number }> {
    const url = `/dbs/merchant-product/objects_autocomplete/?merchant=${merchantId}&search=${search ?? ''}`;
    return this.apiService
      .get<{ objects: ProductAutocompleteModel[]; count: number }>(url)
      .pipe(map(data => data));
  }

  createNewTeller(body: newTellerModel) {
    const url = '/dbs/merchant-teller/';
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
  getActivitySectors(): Observable<{
    objects: SectorActivityModel[];
    count: number;
  }> {
    const url = '/clients/config/activitysector/';
    return this.apiService
      .get<{
        objects: SectorActivityModel[];
        count: number;
      }>(url)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  getCategoriesPerActivitySectors(
    id: string
  ): Observable<{ objects: MerchantCategoriesModel[]; count: number }> {
    const url = '/dbs/merchant-category/?merchant_activity_sector=' + id;
    return this.apiService
      .get<{ objects: MerchantCategoriesModel[]; count: number }>(url)
      .pipe(map(data => data));
  }
  getCategoryMerchants(
    categoryId: number
  ): Observable<{ objects: MerchantAutocompleteModel[]; count: number }> {
    const url = `/dbs/merchant/manage/objects_autocomplete/?merchant_category=${categoryId}`;
    return this.apiService
      .get<{ objects: MerchantAutocompleteModel[]; count: number }>(url)
      .pipe(map(data => data));
  }

  getMerchantProductLookup(lookupData: ProductLookupBodyModel) {
    const url = '/dbs/merchant/product/lookup/';
    return this.apiService.post(url, lookupData).pipe(map(data => data));
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
  searchProduct(pagination: PaginationConfig, search = '') {
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
    return this.apiService
      .get<AllProductAutocompleteModel>(url)
      .pipe(map(data => data));
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

  getTellersByMerchant(merchantId: string) {
    const url = `/dbs/merchant-teller/?merchant=${merchantId}`;
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  doTellerAction(body: doTellerBodyModel) {
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
  updateProductInfo(body: updateProdcutInfoModel) {
    const url = '/dbs/merchant/product/configuration/';
    return this.apiService.post(url, body).pipe(
      map(data => {
        return data;
      })
    );
  }

  /**********************api call of browse by category ******************************/
  getBrowseByCategory() {
    const url = '/dbs/merchant-product-category/';
    return this.apiService.get(url).pipe(map(data => data));
  }
  /******************************************************************************* */
  searchTellersByMerchant(data: searchTellerModel) {
    const url =
      '/dbs/merchant-teller/objects_autocomplete/?merchant=' +
      data.merchant +
      '&search=' +
      data.search;
    return this.apiService.get(url).pipe(map(data => data));
  }
  getMerchantsLocation() {
    const url = '/dbs/merchant/maplist/';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }

  getBestOffer() {
    const url = '/dbs/price-mutations/';
    return this.apiService.get(url).pipe(map(data => data));
  }

  getRecentProducts() {
    const url = '/dbs/merchant-product/objects_autocomplete/?is_recent=true';
    return this.apiService.get(url).pipe(map(data => data));
  }

  getConnectedMerchantId(merchantId: string) {
    this._connectedMerchantId.next(merchantId);
  }

  getMerchantStats(
    merchantId: string
  ): Observable<{ object: MerchantStatsModel }> {
    return this.apiService
      .get<{
        object: MerchantStatsModel;
      }>(
        `/dbs/general/stats/?filter_merchant=${merchantId} &stats_type=merchant_tellers_number,merchant_bills_payment_number,merchant_products_number`
      )
      .pipe(map(data => data));
  }
  addProductByMerchant(product: addProductByMerchantModel) {
    return this.apiService
      .post('/dbs/merchant-product/', product)
      .pipe(map(response => response));
  }

  getBills(pagination: PaginationConfig, dataType = 'all') {
    if (!pagination) {
      pagination = { filters: { limit: 0, offset: 0 } };
    }
    let url = ``;
    switch (dataType) {
      case 'all':
        url = `/dbs/merchant/bills/?limit=${pagination.filters?.limit}&offset=${pagination.filters?.offset}`;
        break;
      case 'requestPayments':
        url = `/dbs/merchant/bills/?payment_status=Q&limit=${pagination.filters?.limit}&offset=${pagination.filters?.offset}`;
        break;
      case 'reports':
        url = `/dbs/merchant/bills/?report=true&limit=${pagination.filters?.limit}&offset=${pagination.filters?.offset}`;
        break;
      default:
        break;
    }
    return this.apiService.get<paymentBillsModel>(url).pipe(map(data => data));
  }

  getBillDetails(billId: string) {
    const url = `/dbs/merchant/bills/${billId}/`;
    return this.apiService.get<paymentBillsModel>(url).pipe(map(data => data));
  }

  generateBill(body: object) {
    const url = '/dbs/merchant/bill-init/';
    return this.apiService
      .post<ObjectBillModel>(url, body)
      .pipe(map(response => response));
  }

  getTopProducts() {
    const url = `/dbs/merchant-product/objects_autocomplete/?limit=4&top_product=true`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  getBillers() {
    const url = `/dbs/merchant/manage/objects_autocomplete/?is_biller=true`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  getFavoriteProductAutocomplete(search: string) {
    const url = `/dbs/merchant-product/objects_autocomplete/?search=${search}&is_favorite_product=true`;
    return this.apiService
      .get<AllProductAutocompleteModel>(url)
      .pipe(map(data => data));
  }

  makeFavoriteProduct(favorite: ProductFavoriteModel) {
    const url = '/dbs/merchant-product/client/favorite/ ';
    return this.apiService.post(url, favorite).pipe(map(data => data));
  }

  doMerchantPaymeny(
    body: DoMerchantTransferModel
  ): Observable<DoMerchantTransferResponseModel> {
    const url = '/dbs/merchant/cashin/';
    return this.apiService
      .post(url, body)
      .pipe(map(response => response as DoMerchantTransferResponseModel));
  }

  doMerchantSimplePayment(data: object) {
    return this.apiService
      .post<ObjectBillModel>('/dbs/merchant/simple/payment/', data)
      .pipe(map(data => data));
  }
}
