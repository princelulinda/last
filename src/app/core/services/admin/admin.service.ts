import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable, map } from 'rxjs';
import { AdminMenuModel } from '../../../components/Operator/operator.models';
import {
  AdminDepartementsDetailsModel,
  AdminDirectionsDetailsModel,
  AdminServicesDetailsModel,
} from '../../../components/rh/rh.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private apiService: ApiService) {}

  getAdminMenuDetails(id: string) {
    return this.apiService.get(`/menu/admin/${id}/`).pipe(map(data => data));
  }

  updateAdminMenu(id: string, data: AdminMenuModel) {
    return this.apiService
      .patch(`/menu/admin/${id}/`, data)
      .pipe(map(data => data));
  }
  getDirectionDetails(
    directionId: number | string
  ): Observable<AdminDirectionsDetailsModel> {
    const url = '/hr/access/directions/' + directionId;
    return this.apiService.get(url);
  }
  getDepartmentDetails(
    depId: number | string
  ): Observable<AdminDepartementsDetailsModel> {
    const url = `/hr/access/departments/${depId}/`;
    return this.apiService.get(url);
  }
  getServiceDetails(
    servId: number | string
  ): Observable<AdminServicesDetailsModel> {
    const url = `/hr/access/services/${servId}/`;
    return this.apiService.get(url);
  }
}
