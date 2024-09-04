import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { map } from 'rxjs';
import { AdminMenuModel } from '../../../components/Operator/operator.models';
import { AutocompleteModel } from '../../../global/models/global.models';

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

  getRoleDetails(id: string) {
    const url = `/hr/access/roles/${id}/`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  getRoleMenus(id: string) {
    const url = `/hr/access/menu/roles/?role=${id}&`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  assignRoleMenus(
    id: string,
    body: {
      menus: AutocompleteModel[];
    }
  ) {
    const url = `/hr/access/roles/${id}/`;
    return this.apiService.patch(url, body).pipe(map(data => data));
  }
}
