import { Injectable } from '@angular/core';
import { map } from 'rxjs';

// import { ApiService } from './api.service';
import { ApiService } from '../api/api.service';
import { toastTypeModel } from '../dialog/dialogs-models';

@Injectable({
  providedIn: 'root',
})
export class SimpleMerchantService {
  constructor(private _apiService: ApiService) {}

  postData(data: object) {
    return this._apiService
      .post<toastTypeModel>('/dbs/merchant/simple/payment/', data)
      .pipe(map(data => data));
  }
}
