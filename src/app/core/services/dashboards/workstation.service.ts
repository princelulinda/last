import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkstationService {
  constructor(private apiService: ApiService) {}

  getWorkstationStats() {
    const url =
      '/dbs/general/stats/?stats_type=agents_number,merchants_number,clients_created';
    return this.apiService.get(url).pipe(map(data => data));
  }
}
