import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { ApiService } from '..';
import {
  AddResponse,
  BodyModel,
} from '../../../components/settings/setting.model';
import { Observable } from 'rxjs';

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
}
