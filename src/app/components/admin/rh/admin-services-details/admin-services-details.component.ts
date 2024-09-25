import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminServicesDetailsModel } from '../rh.model';
import { DialogService, MenuService } from '../../../../core/services';
import { ItemModel } from '../../../../global/components/lookups/lookup/lookup.model';
import { AutocompleteModel } from '../../../../global/models/global.models';
import { PageMenusModel } from '../../menu/menu.models';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from '../../../../global/components/custom-field/multi-select/multi-select.component';

@Component({
  selector: 'app-admin-services-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MultiSelectComponent,
  ],
  templateUrl: './admin-services-details.component.html',
  styleUrl: './admin-services-details.component.scss',
})
export class AdminServicesDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  private pageMenus: PageMenusModel[] = [];
  serviceId!: string | number;
  loadingData = true;
  serviceDetails!: AdminServicesDetailsModel | null;
  defaultDepartmentId!: number;

  selectedMenu: 'details' | 'roles' | 'newRole' = 'details';
  selectedMenus: AutocompleteModel[] = [];
  roleName = new FormControl('', Validators.required);
  roleGroup = new FormControl('', Validators.required);
  isLoading = false;
  object_id!: number;
  showEditForm = false;
  selectedDepartment!: ItemModel;
  name = new FormControl('', Validators.required);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private dialogService: DialogService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.route.fragment.subscribe({
      next: fragment => {
        this.selectedMenu =
          fragment === null
            ? 'details'
            : (fragment as 'details' | 'roles' | 'newRole');
      },
    });

    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: params => {
        this.serviceId = params['id'];
        this.getServiceDetails();
      },
    });

    this.pageMenus = [
      {
        icon: 'circle-info',
        title: 'Details',
        url: `/w/workstation/a/admin/service/${this.serviceId}`,
        icon_classes: 'fs-medium',
      },
      {
        icon: 'users-gear',
        title: 'Roles',
        url: `/w/workstation/a/admin/service/${this.serviceId}`,
        fragment: 'roles',
        icon_classes: 'fs-medium',
      },
      {
        icon: 'plus',
        title: 'New Role',
        url: `/w/workstation/a/admin/service/${this.serviceId}`,
        fragment: 'newRole',
        icon_classes: 'fs-medium',
      },
    ];
    this.menuService.setPageMenus(this.pageMenus);
  }

  createNewRole() {
    this.isLoading = true;
    const body = {
      is_active: true,
      disable_during_leave: true,
      role_name: this.roleName.value as string,
      role_tye: 'C',
      menus: this.selectedMenus,
      role_group: this.roleGroup.value as string,
      content_type: 'hrservice',
      object_id: this.object_id,
    };
    this.adminService
      .createNewRole(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.dialogService.openToast({
            title: '',
            type: 'success',
            message: 'Success',
          });
          this.selectedMenus = [];
          this.roleName.reset();
          this.roleGroup.reset();
          this.getServiceDetails();
          this.selectedMenu = 'roles';
          this.isLoading = false;

          return response;
        },
        error: err => {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'Failed',
          });
          this.isLoading = false;

          return err;
        },
      });
  }

  getServiceDetails() {
    this.loadingData = true;
    this.adminService
      .getServiceDetails(this.serviceId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.serviceDetails = data.object;
          this.object_id = this.serviceDetails.id;
          this.name.setValue(this.serviceDetails.name);
          this.defaultDepartmentId = this.serviceDetails.department;
          this.loadingData = false;
        },
        error: error => {
          console.log(error);
          this.loadingData = false;
        },
      });
  }

  editService() {
    this.isLoading = true;
    const body = {
      name: this.name.value as string,
      department: this.selectedDepartment.id,
      disallow_connexion: false,
    };
    this.adminService
      .editService(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.dialogService.openToast({
            message: 'Success',
            title: '',
            type: 'success',
          });
          this.showEditForm = false;
          this.getServiceDetails();
          this.isLoading = false;

          return response;
        },
        error: err => {
          this.dialogService.openToast({
            message: 'Failed',
            title: '',
            type: 'failed',
          });
          this.isLoading = false;
          return err;
        },
      });
  }

  getSelectedDepartment(dep: ItemModel) {
    this.selectedDepartment = dep;
  }

  getSelectedMenus(menus: AutocompleteModel[] | null) {
    this.selectedMenus = menus as AutocompleteModel[];
  }

  selectMenu(menu: 'details' | 'roles' | 'newRole') {
    if (menu === 'details') {
      this.router.navigate([], { fragment: undefined });
    } else {
      this.router.navigate([], { fragment: menu });
    }
  }
  redirectTo(url: string) {
    return '/w/workstation/desk/admin/' + url;
  }
  refreshData() {
    this.loadingData = true;
    this.serviceDetails = null;
    this.getServiceDetails();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
