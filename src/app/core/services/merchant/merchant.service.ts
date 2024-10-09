import { Injectable } from '@angular/core';

import { BehaviorSubject, map, Observable } from 'rxjs';

import { ApiService } from '../api/api.service';
import { DoMerchantTransferResponseModel } from '../../../components/merchant/merchant-transfer/merchant-transfer.models';
import { DoMerchantTransferModel } from '../../../components/merchant/merchant-transfer/merchant-transfer.models';
import {
  UpdateProdcutInfoModel,
  addProductByMerchantModel,
  ProductAutocompleteModel,
  ProductModel,
  ProductLookupBodyModel,
  ProductLookupModel,
} from '../../../components/merchant/products/products.model';
import {
  BillersAutocompleteModel,
  doTellerBodyModel,
  getMerchantsProductsDetailsModel,
  getPaymentStatsModel,
  MerchantAutocompleteModel,
  MerchantCategoriesAutocompleteModel,
  MerchantInfoModel,
  MerchantModel,
  MerchantSimplePaymentBodyModel,
  MerchantSimplePaymentResponseModel,
  MerchantStatsModel,
  newTellerModel,
  PayMerchantBodyModel,
  PayMerchantResponseModel,
  ProductsModel,
  searchTellerModel,
  SectorActivityAutocompleteModel,
  TellerAutoCompleteModel,
  tellerModel,
  tellersModel,
  TopClientsByAmountModel,
  topClientsByTransactionsModel,
  updateMerchantDetailsBodyModel,
  updateMerchantDetailsModel,
} from '../../../components/merchant/merchant.models';
import { Coords2Model } from '../../../global/components/google-map/map.model';
import { PaginationConfig } from '../../../global/models/pagination.models';
import { BillsModel } from '../../../components/merchant/bills/bills.model';
import {
  InvoiceGroupModel,
  InvoiceModel,
  InvoiceResponseModel,
  MeasureModel,
  ProvidersModel,
  SingleInVoiceModel,
} from '../../../components/dev/invoice/invoice.models';
import {
  ProductCategoryModel,
  ProductOfferModel,
} from '../../../components/dashboards/dashboard.model';

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

  getRecentMerchantsAutocomplete(
    search?: string
  ): Observable<{ objects: MerchantAutocompleteModel[] }> {
    const url = `/dbs/merchant/manage/objects_autocomplete/?search=${search}&is_recent=true`;
    return this.apiService
      .get(url)
      .pipe(map(data => data as { objects: MerchantAutocompleteModel[] }));
  }

  getRecentAllMerchantsAutocomplete(search?: string) {
    const url = `/dbs/merchant/manage/objects_autocomplete/?search=${search}`;
    return this.apiService
      .get<{ objects: MerchantAutocompleteModel[] }>(url)
      .pipe(map(data => data));
  }

  getFavoriteMerchantsAutocomplete(search: string): Observable<{
    objects: MerchantAutocompleteModel[];
    count: number;
  }> {
    const url = `/dbs/merchant/manage/objects_autocomplete/?search='${search}&is_favorite=true`;
    return this.apiService.get(url).pipe(
      map(
        data =>
          data as {
            objects: MerchantAutocompleteModel[];
            count: number;
          }
      )
    );
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

  getTopClientsByAmount(
    merchantId: string
  ): Observable<{ object: TopClientsByAmountModel }> {
    const url = `/dbs/merchant/top-clients/${merchantId}/?by_amount=true`;
    return this.apiService.get<{ object: TopClientsByAmountModel }>(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  getTopClientsByTransactions(
    merchantId: string
  ): Observable<{ object: topClientsByTransactionsModel }> {
    const url = `/dbs/merchant/top-clients/${merchantId}/?by_transaction=true`;
    return this.apiService
      .get<{ object: topClientsByTransactionsModel }>(url)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  getPaymentStats(merchantId: string): Observable<{
    object: getPaymentStatsModel;
  }> {
    const url = `/dbs/merchant/payment_stats/${merchantId}/`;
    return this.apiService.get<{ object: getPaymentStatsModel }>(url).pipe(
      map(data => {
        return data;
      })
    );
  }
  UpdateMerchantDetails(
    id: string,
    data: []
  ): Observable<updateMerchantDetailsModel> {
    const url = '/dbs/merchant/manage/';
    return this.apiService.patch(url + id + '/', data).pipe(
      map(data => {
        return data as updateMerchantDetailsModel;
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
    body: updateMerchantDetailsBodyModel
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
  getMerchantsTellersDetails(id: string): Observable<tellerModel> {
    const url = '/dbs/merchant-teller/';
    return this.apiService.get(url + id).pipe(
      map(data => {
        return data as tellerModel;
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

  getPurchasedProducts(merchantId: string, search?: string) {
    const url = `/dbs/merchant-product/objects_autocomplete/?merchant=${merchantId}&search=${search ?? ''}&provided=true`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  createNewTeller(body: newTellerModel): Observable<tellerModel> {
    const url = '/dbs/merchant-teller/';
    return this.apiService.post(url, body).pipe(
      map(data => {
        return data as tellerModel;
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
    objects: SectorActivityAutocompleteModel[];
    count: number;
  }> {
    const url = '/clients/config/activitysector/objects_autocomplete/';
    return this.apiService
      .get<{
        objects: SectorActivityAutocompleteModel[];
        count: number;
      }>(url)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  getCategoriesPerActivitySectors(id: string): Observable<{
    objects: MerchantCategoriesAutocompleteModel[];
    count: number;
  }> {
    const url =
      '/dbs/merchant-category/objects_autocomplete/?merchant_activity_sector=' +
      id;
    return this.apiService
      .get<{
        objects: MerchantCategoriesAutocompleteModel[];
        count: number;
      }>(url)
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

  getMerchantProductLookup(
    lookupData: ProductLookupBodyModel
  ): Observable<{ object: ProductLookupModel }> {
    const url = '/dbs/merchant/product/lookup/';
    return this.apiService
      .post<{ object: ProductLookupModel }>(url, lookupData)
      .pipe(map(data => data));
  }

  payMerchant(
    paymentData: PayMerchantBodyModel
  ): Observable<{ object: PayMerchantResponseModel }> {
    const url = '/dbs/merchant/product/payment/';
    return this.apiService
      .post<{ object: PayMerchantResponseModel }>(url, paymentData)
      .pipe(map(data => data));
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
      .get<{ objects: ProductAutocompleteModel[]; count: number }>(url)
      .pipe(map(data => data));
  }
  //needed in market-dashboard
  getBIllers(
    biller: boolean
  ): Observable<{ objects: BillersAutocompleteModel[] }> {
    const url = '/dbs/merchant/manage/objects_autocomplete/?is_biller=';
    return this.apiService
      .get(url + biller)
      .pipe(map(data => data as { objects: BillersAutocompleteModel[] }));
  }
  getBillActions(billId: string) {
    const url = `/dbs/merchant/bills/${billId}/object_actions/`;
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }

  getTellersByMerchant(merchantId: string): Observable<tellersModel> {
    const url = `/dbs/merchant-teller/?merchant=${merchantId}`;
    return this.apiService.get(url).pipe(
      map(data => {
        return data as tellersModel;
      })
    );
  }
  getTellersByMerchantAutoComplete(
    merchantId: number
  ): Observable<{ objects: TellerAutoCompleteModel[] }> {
    const url = `/dbs/merchant-teller/objects_autocomplete/?merchant=${merchantId}`;
    return this.apiService
      .get<{ objects: TellerAutoCompleteModel[] }>(url)
      .pipe(map(data => data));
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
  ): Observable<{ objects: MerchantAutocompleteModel[]; count: number }> {
    const url =
      '/dbs/merchant/manage/objects_autocomplete?category_slug=' + slug;
    return this.apiService
      .get<{ objects: MerchantAutocompleteModel[]; count: number }>(url)
      .pipe(map(data => data));
  }

  updateProductInfo(body: UpdateProdcutInfoModel): Observable<{
    object: {
      success: boolean;
      response_message: string;
      response_code: string;
      response_data: UpdateProdcutInfoModel;
    };
  }> {
    const url = '/dbs/merchant/product/configuration/';
    return this.apiService
      .post<{
        object: {
          success: boolean;
          response_message: string;
          response_code: string;
          response_data: UpdateProdcutInfoModel;
        };
      }>(url, body)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  /**********************api call of browse by category ******************************/
  getBrowseByCategory(): Observable<{ objects: ProductCategoryModel[] }> {
    const url = '/dbs/merchant-product-category/';
    return this.apiService
      .get<{ objects: ProductCategoryModel[] }>(url)
      .pipe(map(data => data));
  }
  /******************************************************************************* */
  searchTellersByMerchant(data: searchTellerModel): Observable<tellersModel> {
    const url =
      '/dbs/merchant-teller/objects_autocomplete/?merchant=' +
      data.merchant +
      '&search=' +
      data.search;
    return this.apiService.get(url).pipe(map(data => data as tellersModel));
  }
  getMerchantsLocation() {
    const url = '/dbs/merchant/maplist/';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }

  getBestOffer(): Observable<{
    objects: { id: number; product: ProductOfferModel }[];
  }> {
    const url = '/dbs/price-mutations/';
    return this.apiService
      .get<{
        objects: { id: number; product: ProductOfferModel }[];
      }>(url)
      .pipe(map(data => data));
  }

  getRecentProducts(): Observable<{ objects: ProductAutocompleteModel[] }> {
    const url = '/dbs/merchant-product/objects_autocomplete/?is_recent=true';
    return this.apiService
      .get<{ objects: ProductAutocompleteModel[] }>(url)
      .pipe(map(data => data));
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
    return this.apiService
      .get<{
        object: BillsModel;
        objects: BillsModel[];
        count: number;
      }>(url)
      .pipe(map(data => data));
  }

  getBillDetails(billId: string) {
    const url = `/dbs/merchant/bills/${billId}/`;
    return this.apiService
      .get<{
        object: BillsModel;
        objects: BillsModel[];
        count: number;
      }>(url)
      .pipe(map(data => data));
  }

  generateBill(body: object) {
    const url = '/dbs/merchant/bill-init/';
    return this.apiService
      .post<{ object: MerchantSimplePaymentResponseModel }>(url, body)
      .pipe(map(response => response));
  }

  getTopProducts(): Observable<{ objects: ProductAutocompleteModel[] }> {
    const url = `/dbs/merchant-product/objects_autocomplete/?limit=4&top_product=true`;
    return this.apiService
      .get<{ objects: ProductAutocompleteModel[] }>(url)
      .pipe(map(data => data));
  }

  getBillers(): Observable<{
    objects: BillersAutocompleteModel[];
  }> {
    const url = `/dbs/merchant/manage/objects_autocomplete/?is_biller=true`;
    return this.apiService
      .get<{
        objects: BillersAutocompleteModel[];
      }>(url)
      .pipe(map(data => data));
  }

  getFavoriteProductAutocomplete(search: string) {
    const url = `/dbs/merchant-product/objects_autocomplete/?search=${search}&is_favorite_product=true`;
    return this.apiService
      .get<{ objects: ProductAutocompleteModel[]; count: number }>(url)
      .pipe(map(data => data));
  }

  makeFavoriteProduct(favorite: { product: string; product_action: string }) {
    const url = '/dbs/merchant-product/client/favorite/ ';
    return this.apiService.post(url, favorite).pipe(map(data => data));
  }

  MerchantPayment(
    body: DoMerchantTransferModel
  ): Observable<DoMerchantTransferResponseModel> {
    const url = '/dbs/merchant/cashin/';
    return this.apiService
      .post(url, body)
      .pipe(map(response => response as DoMerchantTransferResponseModel));
  }

  doMerchantSimplePayment(
    data: MerchantSimplePaymentBodyModel
  ): Observable<{ object: MerchantSimplePaymentResponseModel }> {
    return this.apiService
      .post<{
        object: MerchantSimplePaymentResponseModel;
      }>('/dbs/merchant/simple/payment/', data)
      .pipe(map(data => data));
  }

  getBillsGroups(
    pagination: PaginationConfig
  ): Observable<{ objects: InvoiceGroupModel[]; count: number }> {
    const url = `/dbs/bill-group/?limit=${pagination?.filters.limit}&offset=${pagination?.filters.offset}`;
    return this.apiService
      .get<{ objects: InvoiceGroupModel[]; count: number }>(url)
      .pipe(map(data => data));
  }

  getBillsGroupsByTeller(
    merchant_teller_id: number
  ): Observable<{ objects: InvoiceGroupModel[] }> {
    const url = `/dbs/bill-group/?merchant_teller=${merchant_teller_id}`;
    return this.apiService
      .get<{ objects: InvoiceGroupModel[] }>(url)
      .pipe(map(data => data));
  }

  // createBillGroup(teller_info: any) {
  //   const url = `/dbs/bill-group`;
  //   return this.apiService.post(url, teller_info).pipe(map(data => data));
  // }

  createBill(
    invoice: InvoiceModel
  ): Observable<{ object: InvoiceResponseModel }> {
    const url = `/dbs/merchant/bill-validation-init/ `;
    return this.apiService
      .post<{ object: InvoiceResponseModel }>(url, invoice)
      .pipe(map(data => data));
  }
  createBillByGroup(
    invoice: InvoiceModel,
    group_id: number
  ): Observable<{ object: InvoiceResponseModel }> {
    const url = `/dbs/merchant/bill-validation-init/bill_group:${group_id} `;
    return this.apiService
      .post<{ object: InvoiceResponseModel }>(url, invoice)
      .pipe(map(data => data));
  }

  getSupplier(product_id: number): Observable<{ objects: ProvidersModel[] }> {
    const url = `/dbs/merchant-product-provided/?product=${product_id}`;
    return this.apiService
      .get<{ objects: ProvidersModel[] }>(url)
      .pipe(map(data => data));
  }
  getProductMeasure(
    product_id: number
  ): Observable<{ objects: MeasureModel[] }> {
    const url = `/dbs/product-measure/?product=${product_id}`;
    return this.apiService
      .get<{ objects: MeasureModel[] }>(url)
      .pipe(map(data => data));
  }
  addBillToGroup(id_group: number, id_invoice: string) {
    const url = `/dbs/merchant/bills/${id_invoice}/add_bill_group/`;
    const body = { id_group };
    return this.apiService.post(url, body).pipe(map(data => data));
  }
  // getBillsByGroup(group_name: string): Observable<any> {
  //   const url = `/dbs/merchant/bills/?bill_group=${group_name}/`;
  //   return this.apiService
  //     .get<any>(url)
  //     .pipe(map((data: any) => data));
  // }
  getSingleInvoices(pagination: PaginationConfig, search: string) {
    const url = `/dbs/merchant/bills/?limit=${pagination?.filters.limit}&offset=${pagination?.filters.offset}&for_validation=true&grouped=false&search=${search}`;

    return this.apiService
      .get<{ objects: SingleInVoiceModel[]; count: number }>(url)
      .pipe(map(data => data));
  }
  // {id} : facture et body : id_group ofr the method updateInvoicesGroup
  // updateInvoicesGroup(id: number): Observable<any> {
  //   const url = `/dbs/merchant/bills/${id}/add_bill_group/`;
  //   return this.apiService
  //     .post<any>(url)
  //     .pipe(map(data => data));
  // }

  getProductsByMerchant(
    merchantId: string
  ): Observable<{ objects: ProductsModel[] }> {
    const url = '/dbs/merchant-product/?merchant=' + merchantId + '&';
    return this.apiService.get<{ objects: ProductsModel[] }>(url).pipe(
      map(data => {
        return data;
      })
    );
  }

  getMerchantsProductsDetails(
    id: string
  ): Observable<{ object: getMerchantsProductsDetailsModel }> {
    const url = '/dbs/merchant-product/' + id + '/';
    return this.apiService
      .get<{ object: getMerchantsProductsDetailsModel }>(url)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  searchProductByMerchant(data: {
    search: string | null;
    merchant: string;
  }): Observable<{ objects: ProductsModel[] }> {
    const url =
      '/dbs/merchant-product/objects_autocomplete/?merchant=' +
      data.merchant +
      '&search=' +
      data.search;
    return this.apiService
      .get<{ objects: ProductsModel[] }>(url)
      .pipe(map(data => data));
  }
}
