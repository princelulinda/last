import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { map } from 'rxjs';
import { AdminMenuModel } from '../../../components/Operator/operator.models';

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
}
