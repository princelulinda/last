// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
// import { ConfigService, DialogService } from '../../../core/services';
// import { AdminService } from '../../../core/services/admin/admin.service';
// import {
//   FormBuilder,
//   FormControl,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { PaginationConfig } from '../../../global/models/pagination.models';
// import { OrganizationModel } from '../../auth/auth.model';
// import {
//   DialogResponseModel,
//   dialogTypeModel,
// } from '../../../core/services/dialog/dialogs-models';
// import { VariableService } from '../../../core/services/variable/variable.service';
// import { CommonModule } from '@angular/common';
// import { MultiSelectComponent } from '../../dev/multi-select/multi-select.component';

// @Component({
//   selector: 'app-operator-details',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, MultiSelectComponent],
//   templateUrl: './operator-details.component.html',
//   styleUrl: './operator-details.component.scss',
// })
// export class OperatorDetailsComponent implements OnInit, OnDestroy {
//   private onDestroy$: Subject<void> = new Subject<void>();

//   organization$: Observable<OrganizationModel | null>;
//   organizationId!: number;
//   operatorOrganizationId: any;

//   selectedMenu = 'roles';

//   organizationDetails: any;
//   permissionDetails: any;
//   roles: any;
//   rolesId: any;
//   roleMenus: any;
//   allMenus: any;

//   organizationDetailsLoading = true;
//   rolesLoading = true;
//   loadingRoleMenus = false;
//   loadingAllMenus = false;
//   loadingPermission = false;
//   assignLoading = false;
//   isLoading = false;

//   showRoleMenus = false;
//   selectedRole: any;
//   selectedRoleId: any;
//   selectedSection = 'roles';

//   newRoleForm: FormGroup = this.fb.group({
//     begins_at: ['', Validators.required],
//     ends_at: ['', Validators.required],
//   });

//   editRoleForm: FormGroup = this.fb.group({
//     ends_at: ['', Validators.required],
//   });
//   roleIndex: any;
//   selectedRoleToUpdate: any;
//   dialog$: Observable<DialogResponseModel>;
//   dialog!: DialogResponseModel;

//   roleNameToEdit = '';
//   selectedRolesToAssign: any[] = [];
//   searchType = 'roles';
//   rolesSearchInput = new FormControl('');
//   menusSearchInput = new FormControl('');

//   selectedCounterToRemove!: number | string;
//   selectedBrancheToRemove: any;
//   password = '';

//   counterLoading = false;
//   otherBranchesLoading = true;
//   addPermissionLoading = false;

//   otherBranches: any[] = [];
//   defaultBranchesId: number[] = [];
//   defaultCountersId: number[] = [];

//   permissionModalSection = 'list';
//   selectedCounters: any[] = [];

//   operatorAccessForm!: FormGroup;

//   otherBranchesPagination: PaginationConfig = new PaginationConfig();
//   branchesCurrentPage = 0;
//   branchesCount!: number;
//   brancheCountersPagination: PaginationConfig = new PaginationConfig();
//   countersCurrentPage = 0;
//   countersCount!: number;

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private dialogService: DialogService,
//     private adminService: AdminService,
//     private variableService: VariableService,
//     private configService: ConfigService,
//     private fb: FormBuilder
//   ) {
//     this.organization$ = this.configService.getSelectedOrganization();
//     this.dialog$ = this.dialogService.getDialogState();
//   }

//   ngOnInit() {
//     this.otherBranchesPagination.filters.limit = 15;
//     this.brancheCountersPagination.filters.limit = 15;
//     this.organization$.pipe(takeUntil(this.onDestroy$)).subscribe({
//       next: organization => {
//         if (organization) this.organizationId = organization.id;
//       },
//     });

//     this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
//       next: params => {
//         this.operatorOrganizationId = params['id'];
//         this.getOperatorDetails();
//         this.getOperatorRoles();
//         this.getOperatorMenus();
//         this.getOperatorPermissionDetails();
//       },
//     });

//     this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
//       next: dialog => {
//         this.dialog = dialog;

//         if (this.dialog && this.dialog.response) {
//           switch (this.dialog.action) {
//             case 'Update Role':
//               if (this.dialog.response.confirmation === 'YES') {
//                 this.updateRole();
//               }
//               break;
//             case 'Remove Permission Password':
//               // this.password = this.variableService.password;
//               if (this.dialog.response.password) {
//                 this.password = this.dialog.response.password;
//                 this.removePermission();
//               }
//               break;
//             case 'Add Permission Password':
//               // this.password = this.variableService.password;
//               if (this.dialog.response.password) {
//                 this.password = this.dialog.response.password;
//                 this.addPermission();
//               }
//               break;
//           }
//         }
//       },
//     });

//     this.menusSearchInput.valueChanges.pipe(debounceTime(300)).subscribe({
//       next: value => {
//         this.getOperatorMenus(value ?? '');
//       },
//     });

//     this.rolesSearchInput.valueChanges.pipe(debounceTime(300)).subscribe({
//       next: value => {
//         this.getOperatorRoles(false, value ?? '');
//       },
//     });
//   }

//   getOperatorMenus(search?: string) {
//     this.allMenus = null;
//     this.loadingAllMenus = true;
//     this.adminService
//       .getOperatorMenus(this.operatorOrganizationId, search)
//       .subscribe({
//         next: value => {
//           const res = value as any;
//           this.allMenus = res.object;
//           this.loadingAllMenus = false;
//         },
//         error: err => {
//           this.loadingAllMenus = false;
//           return err;
//         },
//       });
//   }

//   getOperatorPermissionDetails() {
//     this.loadingPermission = true;
//     this.permissionDetails = null;
//     this.counterLoading = this.selectedBrancheToRemove ? true : false;
//     this.adminService
//       .getOperatorPermissionDetails(this.operatorOrganizationId)
//       .subscribe({
//         next: value => {
//           const res = value as any;
//           this.loadingPermission = false;
//           this.permissionDetails = res.object;
//           this.defaultBranchesId =
//             this.permissionDetails.permissions_branches.map((b: any) => b.id);
//           this.defaultCountersId =
//             this.permissionDetails.permissions_counters.map((c: any) => c.id);

//           this.getAllBranches();

//           if (this.selectedBrancheToRemove) {
//             this.getCountersByBranch(this.selectedBrancheToRemove.id);
//           }

//           this.operatorAccessForm = this.fb.group({
//             can_see_in_branch: [this.permissionDetails.can_see_in_branch],
//             can_edit_in_branch: [this.permissionDetails.can_edit_in_branch],
//             can_delete_in_branch: [this.permissionDetails.can_delete_in_branch],
//             can_create_in_branch: [this.permissionDetails.can_create_in_branch],
//           });
//         },
//         error: err => {
//           this.loadingPermission = false;
//           return err;
//         },
//       });
//   }

//   getOperatorDetails() {
//     this.organizationDetailsLoading = true;
//     this.organizationDetails = null;
//     this.adminService
//       .getOperatorDetailsOrganization(this.operatorOrganizationId)
//       .pipe(takeUntil(this.onDestroy$))
//       .subscribe({
//         next: value => {
//           const res = value as any;
//           this.organizationDetailsLoading = false;
//           this.organizationDetails = res.object;
//         },
//         error: error => {
//           this.organizationDetailsLoading = false;
//           return error;
//         },
//       });
//   }

//   getOperatorRoles(hasSelectedRole = false, search?: string) {
//     this.rolesLoading = true;
//     this.roles = null;
//     this.adminService
//       .getOperatorRole(this.operatorOrganizationId, search)
//       .pipe(takeUntil(this.onDestroy$))
//       .subscribe({
//         next: data => {
//           const res = data as any;
//           this.roles = res.objects;
//           this.rolesLoading = this.roles.length === 0 ? false : true;
//           this.rolesId = this.getAllIds(this.roles, 'id');

//           if (hasSelectedRole && this.showRoleMenus) {
//             this.selectedRole = this.getRoleById(
//               this.selectedRoleId,
//               this.roles
//             );
//           }
//           this.rolesLoading = false;
//         },
//         error: error => {
//           this.roles = [];

//           this.dialogService.openToast({
//             title: '',
//             message: 'Something went wrong, please retry again!',
//             type: 'failed',
//           });
//           this.rolesLoading = false;
//           return error;
//         },
//       });
//   }

//   getRoleMenus() {
//     if (!this.roleMenus) {
//       this.loadingRoleMenus = true;
//       this.adminService
//         .getRoleMenus(this.selectedRoleId)
//         .pipe(takeUntil(this.onDestroy$))
//         .subscribe({
//           next: response => {
//             const res = response as any;
//             this.roleMenus = res.objects;
//             this.loadingRoleMenus = false;
//           },
//           error: error => {
//             this.loadingRoleMenus = false;
//             return error;
//           },
//         });
//     }
//   }

//   editRoleAtIndex(event: MouseEvent, index: number | string) {
//     event.stopPropagation();
//     if (this.roleIndex === index) {
//       // this.hideActionPopup(event, 'disable');
//       this.roleIndex = null;
//       return;
//     }
//     const data = this.roles[index];
//     this.selectedRoleToUpdate = data;
//     this.selectedRole = data;
//     if (!this.roleIndex) {
//       this.roleIndex = index;
//     } else {
//       this.roleIndex = null;
//     }

//     this.editRoleForm.patchValue({
//       ends_at: new Date(data.ends_at).toISOString().split('.')[0],
//     });
//     this.roleNameToEdit = data.role_name;
//   }

//   assignNewRole() {
//     this.assignLoading = true;
//     const data = this.newRoleForm.value;
//     const date = {
//       begins_at: this.transformLocalDate(data.begins_at),
//       ends_at: this.transformLocalDate(data.ends_at),
//       access_type: 'D',
//     };
//     const body = {
//       roles: (this.selectedRolesToAssign as any[]).map(id => {
//         return {
//           role: id,
//           ...date,
//         };
//       }),
//       ...date,
//     };
//     this.adminService
//       .assignRolesToOperator(this.operatorOrganizationId, body)
//       .subscribe({
//         next: response => {
//           this.getOperatorRoles();
//           this.getOperatorDetails();
//           this.assignLoading = false;
//           this.dialogService.openToast({
//             title: '',
//             message: 'Success',
//             type: 'success',
//           });
//           this.newRoleForm.reset();
//           this.selectedRolesToAssign = [];
//           this.selectSection('roles');
//           this.showRoleMenus = false;
//           return response;
//         },
//         error: error => {
//           this.dialogService.openToast({
//             title: '',
//             message: 'Failed',
//             type: 'failed',
//           });
//           this.assignLoading = false;
//           return error;
//         },
//       });
//   }

//   updateRole() {
//     this.isLoading = true;
//     if (this.dialog.response.confirmation === 'YES') {
//       this.dialogService.dispatchLoading();
//     }
//     const body = {
//       ends_at:
//         this.dialog.response.confirmation !== 'YES'
//           ? this.transformLocalDate(this.editRoleForm.controls['ends_at'].value)
//           : this.transformLocalDate(Date.now()),
//     };
//     const closeModalbtn = document.querySelector('#editRoleForm .close-modal');
//     this.adminService
//       .updateOperatorRole(this.selectedRoleToUpdate.id, body)
//       .subscribe({
//         next: response => {
//           this.dialogService.closeLoading();
//           this.dialogService.openToast({
//             title: '',
//             message: 'Success',
//             type: 'success',
//           });
//           this.getOperatorRoles(true);
//           this.selectedRole = (closeModalbtn as HTMLButtonElement).click();
//           this.isLoading = false;
//           return response;
//         },
//         error: error => {
//           this.dialogService.closeLoading();
//           this.dialogService.openToast({
//             title: '',
//             message: 'Failed',
//             type: 'failed',
//           });
//           this.isLoading = false;
//         },
//       });
//   }

//   getAllBranches() {
//     this.otherBranchesLoading = true;
//     this.otherBranches = [];
//     this.adminService.getBranches(this.otherBranchesPagination).subscribe({
//       next: response => {
//         const res = response as any;
//         this.otherBranches = res.objects;
//         this.branchesCount = res.count;
//         if (this.defaultBranchesId) {
//           this.otherBranches = this.otherBranches.filter(
//             item => !this.defaultBranchesId.includes(item.id)
//           );
//         }
//         this.otherBranchesLoading = false;
//       },
//       error: error => {
//         this.otherBranchesLoading = false;
//         return error;
//       },
//     });
//   }

//   removePermission() {
//     this.dialogService.dispatchLoading();
//     let body: {
//       password: string;
//       counters?: number[];
//       branches?: number[];
//     } = {
//       password: this.password,
//     };
//     if (this.selectedCounterToRemove) {
//       body = {
//         ...body,
//         counters: [this.selectedCounterToRemove as number],
//       };
//     } else if (this.selectedBrancheToRemove.id) {
//       body = {
//         ...body,
//         branches: [this.selectedBrancheToRemove.id],
//       };
//     }

//     this.adminService
//       .removeOperatorPermission(body, this.operatorOrganizationId)
//       ?.subscribe({
//         next: response => {
//           const res = response as any;
//           this.dialogService.closeLoading();
//           this.password = '';
//           if (res.object['success'] !== undefined && !res.object.success) {
//             this.dialogService.openToast({
//               message:
//                 res?.response_message ??
//                 'Something went wrong, please retry again!',
//               title: '',
//               type: 'failed',
//             });
//             return;
//           }
//           this.dialogService.openToast({
//             message: 'Success',
//             title: '',
//             type: 'success',
//           });
//           this.getOperatorPermissionDetails();
//         },
//         error: err => {
//           this.password = '';
//           this.dialogService.closeLoading();
//           this.dialogService.openToast({
//             message:
//               err?.response_message ??
//               'Something went wrong, please retry again!',
//             title: '',
//             type: 'failed',
//           });
//         },
//       });
//   }

//   addPermission() {
//     this.dialogService.dispatchLoading();
//     this.addPermissionLoading = true;
//     let body = {
//       ...this.operatorAccessForm.value,
//       password: this.password,
//     };
//     this.selectedCounterToRemove
//       ? (body = {
//           ...body,
//           counters: [this.selectedCounterToRemove as number],
//         })
//       : (body = { ...body });
//     this.selectedBrancheToRemove.id
//       ? (body = {
//           ...body,
//           branches: [this.selectedBrancheToRemove.id as number],
//         })
//       : (body = { ...body });
//     this.selectedBrancheToRemove.id && this.selectedCounterToRemove
//       ? (body = {
//           ...body,
//           branches: [this.selectedBrancheToRemove.id as number],
//           counters: [this.selectedCounterToRemove as number],
//         })
//       : (body = { ...body });

//     this.adminService
//       .submitOperatorPermission(body, this.operatorOrganizationId)
//       .subscribe({
//         next: response => {
//           this.dialogService.closeLoading();
//           this.addPermissionLoading = false;
//           this.dialogService.openToast({
//             message: 'Success',
//             title: '',
//             type: 'success',
//           });
//           this.getOperatorPermissionDetails();
//           return response;
//         },
//         error: err => {
//           this.dialogService.closeLoading();
//           this.dialogService.openToast({
//             message:
//               err?.response_message ??
//               'Something went wrong, please retry again!',
//             title: '',
//             type: 'failed',
//           });
//           this.addPermissionLoading = false;
//         },
//       });
//   }

//   getCountersByBranch(id: number) {
//     this.counterLoading = true;
//     this.selectedCounters = [];
//     this.adminService
//       .getBranchesCounters(id, this.brancheCountersPagination)

//       .subscribe({
//         next: response => {
//           const res = response as any;
//           this.selectedCounters = res.objects;
//           this.selectedCounters = this.selectedCounters.map(item =>
//             this.defaultCountersId.includes(item.id)
//               ? { ...item, has_access: true }
//               : { ...item, has_access: false }
//           );
//           this.counterLoading = false;
//         },
//         error: err => {
//           this.counterLoading = false;
//           return err;
//         },
//       });
//   }

//   resetModal() {
//     this.selectedCounterToRemove = '';
//     this.selectedBrancheToRemove = null;
//     this.selectedCounters = [];
//     this.permissionModalSection = 'list';
//   }

//   openConfirmDialog(payload: {
//     action: string;
//     message: string;
//     type?: string;
//   }) {
//     this.dialogService.openDialog({
//       title: '',
//       message: payload.message,
//       type: (payload.type as dialogTypeModel) ?? 'confirm',
//       action: payload.action,
//     });
//   }

//   hideActionPopup(event: MouseEvent, action?: string) {
//     this.roleIndex = null;
//     event.stopPropagation();
//     if (action === 'disable') {
//       this.roleIndex;
//       this.openConfirmDialog({
//         action: 'Update Role',
//         message: 'You Want To Temove All Permissions',
//       });
//     }
//   }

//   searchRolesOrMenus() {
//     if (this.searchType === 'roles') {
//       this.getOperatorRoles(false, this.rolesSearchInput.value ?? '');
//     } else if (this.searchType === 'menus') {
//       this.getOperatorMenus(this.menusSearchInput.value ?? '');
//     }
//   }

//   backToRoles() {
//     this.selectedRole = null;
//     this.showRoleMenus = false;
//     this.roleMenus = null;
//   }

//   selectRole(role: any) {
//     this.showRoleMenus = true;
//     this.selectedRole = role;
//     this.selectedRoleId = role.role_id;
//     this.getRoleMenus();
//   }

//   selectedItems(items: any) {
//     this.selectedRolesToAssign = items;
//   }

//   getRoleById(roleId: any, roles: any[]) {
//     let role: any;
//     for (const item of roles) {
//       if (item.id === roleId) {
//         role = item;
//         break;
//       }
//     }
//     return role;
//   }

//   refresh() {
//     this.getOperatorDetails();
//     this.getOperatorRoles();
//     this.getOperatorMenus();
//     this.getOperatorPermissionDetails();
//     this.selectedRole = null;
//     this.showRoleMenus = false;
//   }

//   selectSection(section: any) {
//     this.selectedSection = section;
//   }

//   selectCounterOrBrancheToRemove(type: string, id: number, event?: Event) {
//     if (event) {
//       event.stopPropagation();
//     }
//     if (type === 'counter') {
//       this.selectedCounterToRemove = id;
//     } else if (type === 'branche') {
//       this.selectedBrancheToRemove = id;
//     }
//   }

//   selectMenu(name: string) {
//     if (name === 'roles') {
//       this.selectedSection = 'roles';
//     } else if (name === 'menus') {
//       this.selectedSection = 'menus';
//     }
//     this.selectedMenu = name;
//     this.searchType = name;
//   }

//   toggleActifSection(name: string) {
//     this.permissionModalSection = name;
//   }

//   doListMove(type: string, action: string) {
//     switch (type) {
//       case 'branches':
//         if (action === 'next') {
//           this.branchesCurrentPage += 1;
//         } else {
//           this.branchesCurrentPage -= 1;
//         }

//         // condition just for typescript
//         if (this.otherBranchesPagination.filters.limit) {
//           this.otherBranchesPagination.filters.offset =
//             this.otherBranchesPagination.filters.limit *
//             this.branchesCurrentPage;
//           this.getAllBranches();
//         }
//         break;
//       case 'counters':
//         if (action === 'next') {
//           this.countersCurrentPage += 1;
//         } else {
//           this.countersCurrentPage -= 1;
//         }

//         // condition just for typescript
//         if (this.brancheCountersPagination.filters.limit) {
//           this.brancheCountersPagination.filters.offset =
//             this.brancheCountersPagination.filters.limit *
//             this.countersCurrentPage;
//           this.getCountersByBranch(this.selectedBrancheToRemove.id);
//         }
//         break;
//     }
//   }

//   redirectAt(url: string, event: MouseEvent) {
//     event.stopPropagation();
//     this.router.navigate([url]);
//   }

//   ngOnDestroy(): void {
//     this.onDestroy$.next();
//     this.onDestroy$.complete();
//   }

//   private getAllIds(data: any[], path: string) {
//     const ids: any[] = [];
//     const fields = path.split('.');
//     for (const item of data) {
//       let temp: any = item;
//       for (const field of fields) {
//         temp = temp[field];
//       }
//       ids.push(temp);
//     }
//     return ids;
//   }

//   private transformLocalDate(date: any) {
//     const _date = new Date(date).toISOString().split('T')[0];
//     const _time = new Date(date)
//       .toTimeString()
//       .split(' ')[0]
//       .replace(/(.*)\D\d+/, '$1');
//     return `${_date}T${_time}Z`;
//   }
// }
