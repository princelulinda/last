import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import {
  AdhesionBodyModel,
  AdhesionResponseModel,
  SuggestedTontinesModel,
  TontineDataModele,
  TontineModel,
} from '../../../components/saving/saving.models';
import { map } from 'rxjs/operators';
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
    const url = '/tontine/creation/?registered=true';

    return this.apiService.get<{ objects: TontineModel[] }>(url);
  }

  getSuggestedTontines(): Observable<{ objects: SuggestedTontinesModel[] }> {
    const url = '/tontine/creation/?registered=false"';
    return this.apiService.get<{ objects: SuggestedTontinesModel[] }>(url);
  }

  tontineAdhesion(body: AdhesionBodyModel): Observable<AdhesionResponseModel> {
    const url = '/tontine/membership/demand/';
    return this.apiService
      .post(url, body)
      .pipe(map(response => response as AdhesionResponseModel));
  }

  getTontineDetails(
    tontineId: number
  ): Observable<{ object: TontineDataModele }> {
    const url = `/tontine/creation/${tontineId}`;
    return this.apiService.get<{ object: TontineDataModele }>(url);
  }
}
