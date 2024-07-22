import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import {
  SuggestedTontinesModel,
  TontineDataModele,
  TontineModel,
} from '../../../components/saving/saving.models';

@Injectable({
  providedIn: 'root',
})
export class SavingDetailService {
  constructor(private apiService: ApiService) {}

  //   getTontines(): Observable<{ objects: TontineModel[]; count: number }> {
  //     const url = '/tontines/list/?registered=true';
  //     return this.apiService.get(url);
  //   }

  getClientTontines(): Observable<{ objects: TontineModel[] }> {
    const url = '/tontines/list/?registered=true';
    return this.apiService.get<{ objects: TontineModel[] }>(url);
  }

  getSuggestedTontines(): Observable<{ objects: SuggestedTontinesModel[] }> {
    const url = '/tontines/client/list/?not_registered=true';
    return this.apiService.get<{ objects: SuggestedTontinesModel[] }>(url);
  }

  getSavingData(tontineId: number): Observable<{ tontine: TontineDataModele }> {
    const url = `/tontines/manage/${tontineId}`;
    return this.apiService.get<{ tontine: TontineDataModele }>(url);
  }
}
