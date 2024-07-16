import { Injectable } from '@angular/core';
import { ApiService } from '..';
import { map } from 'rxjs';
// import { PaginationConfig } from './paginatioConfig.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private apiService: ApiService) {}

  //menus Details
  // getAdminMenu() {
  //   return this.apiService.get('/menu/admin/').pipe(
  //     map(data => {
  //       return data;
  //     })
  //   );
  // }
  // getAdminMenuDetails(menu_id: string) {
  //   return this.apiService.get('/menu/admin/' + menu_id + '/').pipe(
  //     map(data => {
  //       return data;
  //     })
  //   );
  // }
  getAdminMenuGroupList() {
    return this.apiService.get('/menugroup/list/').pipe(map(data => data));
  }
  // UpdateAdminMenu(menu_id: string, data: any) {
  //   return this.apiService.patch('/menu/admin/' + menu_id + '/', data).pipe(
  //     map(data => {
  //       return data;
  //     })
  //   );
  // }

  // //menu List
  // setAdminMenu(menuData: any) {
  //   return this.apiService
  //     .post('/menu/admin/', menuData)
  //     .pipe(map(data => data));
  // }

  // //operators List
  // createOperator(body: any) {
  //   const url = '/hr/administration/operator/organization/create/';
  //   return this.apiService.post(url, body).pipe(map(response => response));
  // }

  // //Operator Details
  // getOperatorDetails(operatorId: number | string) {
  //   const apiUrl = '/hr/administration/operators/' + operatorId;
  //   return this.apiService.get(apiUrl).pipe(map(data => data));
  // }
  // updateOperator(operatorId: number | string, data: any) {
  //   const url = '/hr/administration/operators/' + operatorId + '/';
  //   return this.apiService.patch(url, data).pipe(map(data => data));
  // }
  // getOperatorOrganizations(operatorId: number | string) {
  //   const url = '/hr/access/operator/organizations/?operator_pk=' + operatorId;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }
  // getOperatorMenus(operatorId: string | number, search = '') {
  //   const url = `/menu/admin/objects_autocomplete/?operator=${operatorId}&search=${search}`;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }
  // getOperatorPermissionDetails(id: string) {
  //   const url = `/hr/administration/operator/organization/permission_detail/${id}/`;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }
  // removeOperatorPermission(
  //   body: {
  //     password: string;
  //     branches?: number[];
  //     counters?: number[];
  //   },
  //   operatorId: number
  // ) {
  //   if (body.branches || body.counters) {
  //     const url = `/hr/administration/operator/organization/permission_remove/${operatorId}/`;
  //     return this.apiService.patch(url, body);
  //   }
  //   return null;
  // }

  // submitOperatorPermission(
  //   body: {
  //     password: string;
  //     can_see_in_branch?: boolean;
  //     can_edit_in_branch?: boolean;
  //     can_delete_in_branch?: boolean;
  //     can_create_in_branch?: boolean;
  //     branches?: number[];
  //     counters?: number[];
  //   },
  //   operatorId: number
  // ) {
  //   const url = `/hr/administration/operator/organization/permission_detail/${operatorId}/`;
  //   return this.apiService.patch(url, body).pipe(map(data => data));
  // }

  // //operator Roles
  // getOperatorRole(organizationId: number | string, search = '') {
  //   const url = `/hr/access/operator/roles/objects_autocomplete/?hr_operator=${organizationId}&state=active&search=${search}`;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }
  // getOperatorDetailsOrganization(organizationId: number | string) {
  //   const url = `/hr/operator/organizations/manage/${organizationId}/?list_type=all`;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }

  // assignRolesToOperator(organizationId: any, body: any) {
  //   const url = `/hr/operator/organizations/manage/${organizationId}/?list_type=all`;
  //   return this.apiService.patch(url, body).pipe(map(data => data));
  // }
  // updateOperatorRole(roleId: any, body: any) {
  //   const url = '/hr/access/operator/roles/' + roleId + '/';
  //   return this.apiService.patch(url, body).pipe(map(data => data));
  // }

  // //roles details
  // getAllRoles() {
  //   return this.apiService.get('/hr/access/roles/').pipe(map(data => data));
  // }

  // createNewRole(body: any) {
  //   const url = `/hr/access/roles/`;
  //   return this.apiService.post(url, body).pipe(map(data => data));
  // }

  // getRoleDetails(roleId: number | string) {
  //   const url = '/hr/access/roles/' + roleId;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }
  // getRoleMenus(roleId: any) {
  //   const url = `/hr/access/menu/roles/?role=${roleId}&`;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }
  // assignRoleMenus(roleId: any, body: any) {
  //   const url = `/hr/access/roles/${roleId}/`;
  //   return this.apiService.patch(url, body).pipe(map(data => data));
  // }

  // //tellers services
  // getTellerDetails(tellerId: number | string) {
  //   const url = '/hr/tellers/list/' + tellerId;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }

  // //treasurers services
  // getTreasurerDetails(treasurerId: number | string) {
  //   const url = '/hr/treasurers/list/' + treasurerId;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }

  // //branches services
  // getBranches(pagination: PaginationConfig) {
  //   const url = `/hr/branches/?limit=${pagination?.filters.limit}&offset=${pagination?.filters.offset}`;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }
  // getBranchDetails(branchId: number | string) {
  //   const url = '/hr/branches/' + branchId;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }
  // addNewBranch(body: any) {
  //   const url = '/hr/branches/';
  //   return this.apiService.post(url, body).pipe(map(data => data));
  // }

  // //counters services
  // getBranchesCounters(branchId: number, pagination: PaginationConfig) {
  //   const url = `/hr/counter/?branch=${branchId}&limit=${pagination.filters.limit}&offset=${pagination.filters.offset}`;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }
  // getCounterDetails(counterId: number | string) {
  //   const url = '/hr/counter/' + counterId;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }
  // addNewCounter(body: any) {
  //   const url = `/hr/counter/`;
  //   return this.apiService.post(url, body).pipe(map(data => data));
  // }
  // getMainBoxDetails(boxId: any) {
  //   const url = `/hr/counter-mainbox/${boxId}`;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }
  // newMainBox(body: any) {
  //   const url = `/hr/counter-mainbox/`;
  //   return this.apiService.post(url, body).pipe(map(data => data));
  // }

  // //direction services
  // getDirectionDetails(directionId: number | string) {
  //   const url = '/hr/access/directions/' + directionId;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }
  // createNewDirection(body: any) {
  //   const url = `/hr/access/directions/`;
  //   return this.apiService.post(url, body).pipe(map(data => data));
  // }
  // editDirection(body: any) {
  //   const url = '/hr/access/directions/';
  //   return this.apiService.patch(url, body).pipe(map(data => data));
  // }

  // //department services
  // getDepartmentDetails(depId: number | string) {
  //   const url = `/hr/access/departments/${depId}/`;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }
  // createNewDepartement(body: any) {
  //   const url = '/hr/access/departments/';
  //   return this.apiService.post(url, body).pipe(map(data => data));
  // }
  // editDepartment(body: any) {
  //   const url = '/hr/access/departments/';
  //   return this.apiService.patch(url, body).pipe(map(data => data));
  // }

  // //service
  // getServiceDetails(servId: number | string) {
  //   const url = `/hr/access/services/${servId}/`;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }
  // createNewService(body: any) {
  //   const url = `/hr/access/services/`;
  //   return this.apiService.post(url, body).pipe(map(data => data));
  // }
  // editService(body: any) {
  //   const url = `/hr/access/services/`;
  //   return this.apiService.patch(url, body).pipe(map(data => data));
  // }

  // //access
  // getAccessDetails(accessId: string | number) {
  //   const url = '/hr/access/acl/categories/' + accessId;
  //   return this.apiService.get(url).pipe(map(data => data));
  // }

  // //assignation
  // assignOperatorToCounter(body: any) {
  //   const url = '/hr/counter/operator/assignment/';
  //   return this.apiService.post(url, body).pipe(map(data => data));
  // }
}
