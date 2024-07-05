import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { ApiService } from '..';
import { BodyModel } from '../../../components/settings/setting.model';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private apiService: ApiService) {
    //
  }

  addAphoneNumber(body: BodyModel) {
    return this.apiService.post('/extid/creation/', body).pipe(
      map(data => {
        return data;
      })
    );
  }
}
