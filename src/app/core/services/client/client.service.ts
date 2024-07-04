import { Injectable } from '@angular/core';

import { ApiService } from '..';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private apiService: ApiService) {
    //
  }

  //   addAphoneNumber(body: any) {
  //     return this.apiService.post('/extid/creation/', body).pipe(
  //         map((data) => {
  //             return data;
  //         })
  //     );
  // }
}
