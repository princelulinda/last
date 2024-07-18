import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { ApiService } from '..';
import {
  AddResponse,
  BodyModel,
} from '../../../components/settings/settings.models';
import { Observable } from 'rxjs';
import { accountsList } from '../../../components/account/models';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private apiService: ApiService) {
    //
  }

  addAphoneNumber(body: BodyModel): Observable<AddResponse> {
    const url = '/extid/creation/';
    return this.apiService.post(url, body).pipe(
      map(response => {
        return response as AddResponse;
      })
    );
  }

  getClientAccounts(clientId: number): Observable<{ objects: accountsList[] }> {
    const url = '/accounts/' + clientId + '/';
    return this.apiService.get<{ objects: accountsList[] }>(url);
  }
}
