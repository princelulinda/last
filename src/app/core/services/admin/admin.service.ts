import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable, map } from 'rxjs';
import {
  AdminCreateNewDepartmentBodyModel,
  AdminCreateNewDepartmentModel,
  AdminDepartementsDetailsModel,
  AdminDirectionsDetailsModel,
  AdminServicesDetailsModel,
  CreateNewDirectionBodyModel,
  CreateNewDirectionModel,
  CreateNewRoleModel,
  CreateNewServiceBodyModel,
  CreateNewServiceModel,
} from '../../../components/admin/rh/rh.model';
import { PaginationConfig } from '../../../global/models/pagination.models';
import {
  AdminMenuBodyModel,
  AdminMenuModel,
} from '../../../components/admin/menu/menu.models';
import {
  AllBranchModel,
  AllMenuListModel,
  BranchesCountersModel,
  NewOperatorModel,
  OrganizationDetailsModel,
  PermissionModel,
  RoleBodyModel,
  RoleListModel,
  RoleMenuModels,
} from '../../../components/admin/operator/operator.models';
import {
  AddBranchResponseModel,
  AddBranchCounterBodyModel,
  AddCounterBranchResponseModel,
  CounterDetailsModele,
  TellerDetailsModele,
  TreaureDetailsModele,
} from '../../../components/admin/agence/agence.models';
import { BranchDetailsModele } from '../../../components/admin/agence/agence.models';
import {
  RoleMenuModel,
  RoleModel,
} from '../../../components/admin/role/role.models';
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private apiService: ApiService) {}

  getAdminMenuDetails(id: string): Observable<{ object: AdminMenuModel }> {
    return this.apiService
      .get<{ object: AdminMenuModel }>(`/menu/admin/${id}/`)
      .pipe(map(data => data));
  }

  updateAdminMenu(
    id: string,
    data: AdminMenuModel
  ): Observable<{ object: AdminMenuModel }> {
    return this.apiService
      .patch<{ object: AdminMenuModel }>(`/menu/admin/${id}/`, data)
      .pipe(map(data => data));
  }

  setAdminMenu(
    menuData: AdminMenuBodyModel
  ): Observable<{ object: RoleMenuModels }> {
    return this.apiService
      .post<{ object: RoleMenuModels }>('/menu/admin/', menuData)
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
  ): Observable<{ object: AdminDepartementsDetailsModel }> {
    const url = `/hr/access/departments/${depId}/`;
    return this.apiService.get(url);
  }
  getServiceDetails(
    servId: number | string
  ): Observable<{ object: AdminServicesDetailsModel }> {
    const url = `/hr/access/services/${servId}/`;
    return this.apiService.get(url);
  }
  getRoleDetails(id: string): Observable<{ object: RoleModel }> {
    const url = `/hr/access/roles/${id}/`;
    return this.apiService
      .get<{ object: RoleModel }>(url)
      .pipe(map(data => data));
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

  getCounterDetails(
    counterId: number
  ): Observable<{ object: CounterDetailsModele }> {
    const url = `/hr/counter/${counterId}`;
    return this.apiService.get<{ object: CounterDetailsModele }>(url);
  }
  getBranchDetails(
    branchId: number
  ): Observable<{ object: BranchDetailsModele }> {
    const url = `/hr/branches/${branchId}`;
    return this.apiService.get<{ object: BranchDetailsModele }>(url);
  }

  getRoleMenus(id: number | string): Observable<{ objects: RoleMenuModel[] }> {
    const url = `/hr/access/menu/roles/?role=${id}&`;
    return this.apiService
      .get<{ objects: RoleMenuModel[] }>(url)
      .pipe(map(data => data));
  }

  assignRoleMenus(
    id: string,
    body: {
      menus: number[];
    }
  ) {
    const url = `/hr/access/roles/${id}/`;
    return this.apiService.patch(url, body).pipe(map(data => data));
  }

  getOperatorMenus(
    operatorId: string | number,
    search = ''
  ): Observable<{ objects: AllMenuListModel[] }> {
    const url = `/menu/admin/objects_autocomplete/?operator=${operatorId}&search=${search}`;
    return this.apiService
      .get<{ objects: AllMenuListModel[] }>(url)
      .pipe(map(data => data));
  }

  getOperatorPermissionDetails(
    id: string
  ): Observable<{ object: PermissionModel }> {
    const url = `/hr/administration/operator/organization/permission_detail/${id}/`;
    return this.apiService
      .get<{ object: PermissionModel }>(url)
      .pipe(map(data => data));
  }

  getOperatorDetailsOrganization(
    organizationId: number | string
  ): Observable<{ object: OrganizationDetailsModel }> {
    const url = `/hr/operator/organizations/manage/${organizationId}/?list_type=all`;
    return this.apiService
      .get<{ object: OrganizationDetailsModel }>(url)
      .pipe(map(data => data));
  }

  addBranchCounter(
    body: AddBranchCounterBodyModel
  ): Observable<AddCounterBranchResponseModel> {
    const url = `/hr/counter/`;
    return this.apiService.post<AddCounterBranchResponseModel>(url, body).pipe(
      map(response => {
        return response;
      })
    );
  }

  addNewBranch(
    name: string,
    hr_chief: number
  ): Observable<AddBranchResponseModel> {
    const url = `/hr/branches/`;
    const body = {
      name,
      hr_chief,
    };
    return this.apiService.post<AddBranchResponseModel>(url, body).pipe(
      map(response => {
        return response;
      })
    );
  }

  addNewMainBox(
    title: string,
    counter: number,
    currency: number
  ): Observable<AddBranchResponseModel> {
    const url = `/hr/counter-mainbox/`;
    const body = {
      title,
      counter,
      currency,
    };
    return this.apiService.post(url, body).pipe(
      map(response => {
        return response as AddBranchResponseModel;
      })
    );
  }

  getOperatorRole(
    organizationId: number | string,
    search = ''
  ): Observable<{ objects: RoleListModel[] }> {
    const url = `/hr/access/operator/roles/objects_autocomplete/?hr_operator=${organizationId}&state=active&search=${search}`;
    return this.apiService
      .get<{ objects: RoleListModel[] }>(url)
      .pipe(map(data => data));
  }

  createOperator(body: {
    client: number;
    pin_code: number;
  }): Observable<{ object: NewOperatorModel }> {
    const url = '/hr/administration/operator/organization/create/';
    return this.apiService
      .post<{ object: NewOperatorModel }>(url, body)
      .pipe(map(response => response));
  }

  assignRolesToOperator(organizationId: string, body: RoleBodyModel) {
    const url = `/hr/operator/organizations/manage/${organizationId}/?list_type=all`;
    return this.apiService.patch(url, body).pipe(map(data => data));
  }

  updateOperatorRole(roleId: number | string, body: RoleBodyModel) {
    const url = '/hr/access/operator/roles/' + roleId + '/';
    return this.apiService.patch(url, body).pipe(map(data => data));
  }

  getBranches(
    pagination: PaginationConfig
  ): Observable<{ objects: AllBranchModel[]; count: number }> {
    const url = `/hr/branches/?limit=${pagination?.filters.limit}&offset=${pagination?.filters.offset}`;
    return this.apiService
      .get<{ objects: AllBranchModel[]; count: number }>(url)
      .pipe(map(data => data));
  }

  removeOperatorPermission(
    body: {
      password: string;
      branches?: number[];
      counters?: number[];
    },
    operatorId: number
  ): Observable<{ object: PermissionModel }> | null {
    if (body.branches || body.counters) {
      const url = `/hr/administration/operator/organization/permission_remove/${operatorId}/`;
      return this.apiService.patch<{ object: PermissionModel }>(url, body);
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

  getBranchesCounters(
    branchId: number,
    pagination: PaginationConfig
  ): Observable<{
    objects: BranchesCountersModel[];
    count: number;
  }> {
    const url = `/hr/counter/?branch=${branchId}&limit=${pagination.filters.limit}&offset=${pagination.filters.offset}`;
    return this.apiService
      .get<{
        objects: BranchesCountersModel[];
        count: number;
      }>(url)
      .pipe(map(data => data));
  }
  createNewDepartement(
    body: AdminCreateNewDepartmentBodyModel
  ): Observable<AdminCreateNewDepartmentModel> {
    const url = '/hr/access/departments/';
    return this.apiService
      .post<AdminCreateNewDepartmentModel>(url, body)
      .pipe(map(data => data));
  }
  createNewDirection(
    body: CreateNewDirectionBodyModel
  ): Observable<CreateNewDirectionModel> {
    const url = `/hr/access/directions/`;
    return this.apiService
      .post<CreateNewDirectionModel>(url, body)
      .pipe(map(data => data));
  }
  createNewService(
    body: CreateNewServiceBodyModel
  ): Observable<CreateNewServiceModel> {
    const url = `/hr/access/services/`;
    return this.apiService
      .post<CreateNewServiceModel>(url, body)
      .pipe(map(data => data));
  }

  createNewRole(body: CreateNewRoleModel) {
    const url = `/hr/access/roles/`;
    return this.apiService.post(url, body).pipe(map(data => data));
  }

  editService(body: {
    name: string;
    direction?: number;
    department?: number;
    disallow_connexion?: boolean;
  }) {
    const url = `/hr/access/services/`;
    return this.apiService.patch(url, body).pipe(map(data => data));
  }
}
