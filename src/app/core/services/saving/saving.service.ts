import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { TontineModel } from '../../../components/saving/saving.model';

@Injectable({
  providedIn: 'root',
})
export class SavingDetailService {
  constructor(private apiService: ApiService) {}

  getTontines(): Observable<{ objects: TontineModel[]; count: number }> {
    const url = '/tontines/list/?registered=true';
    return this.apiService.get(url);
  }
}
