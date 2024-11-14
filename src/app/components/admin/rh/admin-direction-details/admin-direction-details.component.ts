import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { AdminDirectionsDetailsModel } from '../rh.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService, MenuService } from '../../../../core/services';
import { CommonModule } from '@angular/common';
import { PageMenusModel } from '../../menu/menu.models';
import { MultiSelectComponent } from '../../../../global/components/custom-field/multi-select/multi-select.component';

@Component({
  selector: 'app-admin-direction-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MultiSelectComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-direction-details.component.html',
  styleUrl: './admin-direction-details.component.scss',
})
export class AdminDirectionDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  private pageMenus: PageMenusModel[] = [];
  directionId!: string | number;
  directionDetails!: AdminDirectionsDetailsModel | null;
  loadingData = true;

  selectedMenu: 'details' | 'roles' | 'newRole' = 'details';
  selectedMenus: number[] = [];
  roleName = new FormControl('', Validators.required);
  roleGroup = new FormControl('', Validators.required);
  isLoading = false;
  object_id!: number;

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
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
        this.directionId = params['id'];
        this.getDirectionDetails();
      },
    });

    this.pageMenus = [
      {
        icon: 'circle-info',
        title: 'Details',
        url: `/w/workstation/a/admin/direction/${this.directionId}`,
        icon_classes: 'fs-medium',
      },
      {
        icon: 'users-gear',
        title: 'Roles',
        url: `/w/workstation/a/admin/direction/${this.directionId}`,
        fragment: 'roles',
        icon_classes: 'fs-medium',
      },
      {
        icon: 'plus',
        title: 'New Role',
        url: `/w/workstation/a/admin/direction/${this.directionId}`,
        fragment: 'newRole',
        icon_classes: 'fs-medium',
      },
    ];
    this.menuService.setPageMenus(this.pageMenus);
  }
  // object_id!:string;
  getDirectionDetails() {
    this.loadingData = true;
    this.adminService
      .getDirectionDetails(this.directionId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.directionDetails = data;
          this.object_id = this.directionDetails.object.id;
          this.loadingData = false;
        },
        error: () => {
          this.loadingData = false;
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
      content_type: 'hrdirection',
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
          this.getDirectionDetails();
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
          return err;
        },
      });
  }

  getSelectedMenus(menus: number[] | null) {
    this.selectedMenus = menus as number[];
  }
  selectMenu(menu: 'details' | 'roles' | 'newRole') {
    // this.selectedMenu = menu;
    if (menu === 'details') {
      this.router.navigate([], { fragment: undefined });
    } else {
      this.router.navigate([], { fragment: menu });
    }
  }
  redirectTo(url: string) {
    return '/w/workstation/a/admin/' + url;
  }

  refreshData() {
    this.loadingData = true;
    this.directionDetails = null;
    this.getDirectionDetails();
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
