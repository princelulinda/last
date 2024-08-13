import { Injectable } from '@angular/core';
import { map } from 'rxjs';

// import { ApiService } from './api.service';
import { ApiService } from '../api/api.service';
import { ObjectBillModel } from '../../../components/merchant/products/products.model';

@Injectable({
  providedIn: 'root',
})
export class SimpleMerchantService {
  constructor(private _apiService: ApiService) {}

  postData(data: object) {
    return this._apiService
      .post<ObjectBillModel>('/dbs/merchant/simple/payment/', data)
      .pipe(map(data => data));
  }
}
