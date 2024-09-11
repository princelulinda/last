import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable, map } from 'rxjs';
import {
  AdminDepartementsDetailsModel,
  AdminDirectionsDetailsModel,
  AdminServicesDetailsModel,
} from '../../../components/rh/rh.model';
import { AutocompleteModel } from '../../../global/models/global.models';
import { PaginationConfig } from '../../../global/models/pagination.models';
import { AdminMenuModel } from '../../../components/admin/menu/menu.models';
import { RoleBodyModel } from '../../../components/admin/operator/operator.models';
import {
  TellerDetailsModele,
  TreaureDetailsModele,
} from '../../../components/admin/agence/agence.models';

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
  getRoleDetails(id: string) {
    const url = `/hr/access/roles/${id}/`;
    return this.apiService.get(url).pipe(map(data => data));
  }
  getTellerDetails(
    tellerId: number
  ): Observable<{ object: TellerDetailsModele }> {
    const url = `/hr/tellers/list/${tellerId}`;
    return this.apiService.get<{ object: TellerDetailsModele }>(url);
  }
  getTreasureDetails(
    treasureId: number
  ): Observable<{ object: TreaureDetailsModele }> {
    const url = `/hr/treasurers/list/${treasureId}`;
    return this.apiService.get<{ object: TreaureDetailsModele }>(url);
  }

  getRoleMenus(id: number | string) {
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

  getOperatorMenus(operatorId: string | number, search = '') {
    const url = `/menu/admin/objects_autocomplete/?operator=${operatorId}&search=${search}`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  getOperatorPermissionDetails(id: string) {
    const url = `/hr/administration/operator/organization/permission_detail/${id}/`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  getOperatorDetailsOrganization(organizationId: number | string) {
    const url = `/hr/operator/organizations/manage/${organizationId}/?list_type=all`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  getOperatorRole(organizationId: number | string, search = '') {
    const url = `/hr/access/operator/roles/objects_autocomplete/?hr_operator=${organizationId}&state=active&search=${search}`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  assignRolesToOperator(organizationId: string, body: RoleBodyModel) {
    const url = `/hr/operator/organizations/manage/${organizationId}/?list_type=all`;
    return this.apiService.patch(url, body).pipe(map(data => data));
  }

  // updateOperatorRole(roleId: any, body: any) {
  //   const url = '/hr/access/operator/roles/' + roleId + '/';
  //   return this.apiService.patch(url, body).pipe(map(data => data));
  // }

  getBranches(pagination: PaginationConfig) {
    const url = `/hr/branches/?limit=${pagination?.filters.limit}&offset=${pagination?.filters.offset}`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  removeOperatorPermission(
    body: {
      password: string;
      branches?: number[];
      counters?: number[];
    },
    operatorId: number
  ) {
    if (body.branches || body.counters) {
      const url = `/hr/administration/operator/organization/permission_remove/${operatorId}/`;
      return this.apiService.patch(url, body);
    }
    return null;
  }

  submitOperatorPermission(
    body: {
      password: string;
      can_see_in_branch?: boolean;
      can_edit_in_branch?: boolean;
      can_delete_in_branch?: boolean;
      can_create_in_branch?: boolean;
      branches?: number[];
      counters?: number[];
    },
    operatorId: number
  ) {
    const url = `/hr/administration/operator/organization/permission_detail/${operatorId}/`;
    return this.apiService.patch(url, body).pipe(map(data => data));
  }

  getBranchesCounters(branchId: number, pagination: PaginationConfig) {
    const url = `/hr/counter/?branch=${branchId}&limit=${pagination.filters.limit}&offset=${pagination.filters.offset}`;
    return this.apiService.get(url).pipe(map(data => data));
  }
}
