import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { ApiService } from '..';
// import { GeneralService } from '..';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  objectModel,
  ProductModel,
} from '../../../components/dashboards/dashboard.model';
import { StatsModel } from '../../../components/products/products.model';
import { Pagination } from '../merchant/model';
// import { offset } from '@popperjs/core';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  apiUrl!: string;

  constructor(private apiService: ApiService) {
    //comment
  }

  private _connectedMerchantId: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  get connectedMerchantId$(): Observable<string> {
    return this._connectedMerchantId.asObservable();
  }

  getConnectedMerchantId(merchantId: string) {
    this._connectedMerchantId.next(merchantId);
  }

  getMerchantStats(merchantId: string) {
    return this.apiService
      .get<StatsModel>(
        `/dbs/general/stats/?filter_merchant=${merchantId} &stats_type=merchant_tellers_number,merchant_bills_payment_number,merchant_products_number`
      )
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  addProductByMerchant(product: ProductModel) {
    return this.apiService
      .post('/dbs/merchant-product/', product)
      .pipe(map(response => response));
  }

  getBills(pagination: Pagination, dataType = 'all') {
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
    return this.apiService.get(url).pipe(map(data => data));
  }

  getBillDetails(billId: string) {
    const url = `/dbs/merchant/bills/${billId}/`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  // getBillsReportCount() {
  //     const url = '/dbs/merchant/bills/?report=true&limit=1&offset=0';
  //     return this.apiService.get(url).pipe(map((data) => data.count));
  // }
  generateBill(body: object) {
    const url = '/dbs/merchant/bill-init/';
    return this.apiService
      .post<objectModel>(url, body)
      .pipe(map(response => response));
  }

  // getPaymentReportCount() {
  //     const url =
  //         '/operations/pending/logic/?req_type=merchant_transfers&limit=1&offset=0';
  //     return this.apiService.get(url).pipe(map((data: any) => data.count));
  // }
}
