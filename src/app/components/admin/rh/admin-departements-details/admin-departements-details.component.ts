import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminDepartementsDetailsModel } from '../rh.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService, MenuService } from '../../../../core/services';
import { AutocompleteModel } from '../../../../global/models/global.models';
import { ItemModel } from '../../../../global/components/lookups/lookup/lookup.model';
import { CommonModule } from '@angular/common';
import { PageMenusModel } from '../../menu/menu.models';
import { MultiSelectComponent } from '../../../../global/components/custom-field/multi-select/multi-select.component';

@Component({
  selector: 'app-admin-departements-details',
  standalone: true,
  imports: [
    MultiSelectComponent,
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-departements-details.component.html',
  styleUrl: './admin-departements-details.component.scss',
})
export class AdminDepartementsDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  private pageMenus: PageMenusModel[] = [];
  depId!: string | number;
  depDetails!: AdminDepartementsDetailsModel | null;
  // depDetails!: any;
  loadingData = true;
  defaultDirectionId!: number | null;

  showEditForm = false;

  selectedDirection!: ItemModel | null;
  name = new FormControl('', Validators.required);
  selectedMenu: 'details' | 'roles' | 'newRole' = 'details';
  selectedMenus: AutocompleteModel[] = [];
  roleName = new FormControl('', Validators.required);
  roleGroup = new FormControl('', Validators.required);
  isLoading = false;

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
        this.depId = params['id'];
        this.getDepDetails();
      },
    });

    this.pageMenus = [
      {
        icon: 'circle-info',
        title: 'Details',
        url: `/w/workstation/a/admin/department/${this.depId}`,
        icon_classes: 'fs-medium',
      },
      {
        icon: 'users-gear',
        title: 'Roles',
        url: `/w/workstation/a/admin/department/${this.depId}`,
        fragment: 'roles',
        icon_classes: 'fs-medium',
      },
      {
        icon: 'plus',
        title: 'New Role',
        url: `/w/workstation/a/admin/department/${this.depId}`,
        fragment: 'newRole',
        icon_classes: 'fs-medium',
      },
    ];
    this.menuService.setPageMenus(this.pageMenus);
  }

  getDepDetails() {
    this.adminService
      .getDepartmentDetails(this.depId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          console.log(data);
          this.depDetails = data.object;
          this.loadingData = false;
          this.defaultDirectionId = this.depDetails.direction;
          this.name.setValue(this.depDetails.name);
        },
        error: err => {
          // console.log(error);
          this.loadingData = false;
          return err;
        },
      });
  }

  editDepartment() {
    this.isLoading = true;
    const body = {
      name: this.name.value as string,
      direction: this.selectedDirection?.id as number,
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
          this.name.reset();
          this.defaultDirectionId = null;
          this.showEditForm = false;
          this.getDepDetails();
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

  createNewRole() {
    this.isLoading = true;
    const body = {
      is_active: true,
      disable_during_leave: true,
      role_name: this.roleName.value as string,
      role_tye: 'C',
      menus: this.selectedMenus,
      role_group: this.roleGroup.value as string,
      content_type: 'hrdepartment',
      object_id: this.depId as number,
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
          this.getDepDetails();
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

  getSelectedMenus(menus: AutocompleteModel[] | null) {
    this.selectedMenus = menus as AutocompleteModel[];
  }
  getSelectedDirection(dir: ItemModel) {
    this.selectedDirection = dir;
  }

  redirectTo(url: string) {
    return '/w/workstation/a/admin/' + url;
  }

  selectMenu(menu: string) {
    // this.selectedMenu = menu;
    if (menu === 'details') {
      this.router.navigate([], { fragment: undefined });
    } else {
      this.router.navigate([], { fragment: menu });
    }
  }
  refreshData() {
    this.loadingData = true;
    this.depDetails = null;
    this.getDepDetails();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
