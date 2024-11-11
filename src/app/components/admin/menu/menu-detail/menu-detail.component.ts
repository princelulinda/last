import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

import { DialogService } from '../../../../core/services';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';
import { AdminMenuModel } from '../menu.models';

@Component({
  selector: 'app-menu-detail',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, LookupComponent],
  templateUrl: './menu-detail.component.html',
  styleUrl: './menu-detail.component.scss',
})
export class MenuDetailComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  id!: string;
  menuGroupId!: string;
  menuDetails!: AdminMenuModel | null;

  menuForm = this.fb.group({
    name: ['', Validators.required],
    component_url: [''],
    mobile_url: [''],
    fragment: [''],
    icon: ['', Validators.required],
    active: [false],
  });

  selectedMenu = 'details';
  showUpdateForm = false;
  isLoading = false;
  loadingData = true;
  errorMessage = '';
  selectedMenuId!: string;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: data => {
        this.id = data['id'];
        this.getAdminMenuDetails();
      },
    });
  }

  getAdminMenuDetails() {
    this.loadingData = true;
    this.adminService
      .getAdminMenuDetails(this.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: menu => {
          this.loadingData = false;
          const res = menu;
          this.menuDetails = res.object;
          this.menuGroupId =
            this.menuDetails?.menu_group_info?.id.toString() || '';

          this.menuForm.patchValue({
            name: this.menuDetails.name,
            component_url: this.menuDetails.component_url,
            mobile_url: this.menuDetails.mobile_url,
            fragment: this.menuDetails.fragment,
            icon: this.menuDetails.icon,
            active: this.menuDetails.active,
          });
          this.showUpdateForm = false;
        },

        error: () => {
          this.loadingData = false;
          this.errorMessage = `Data not found`;
        },
      });
  }

  updateAdminMenu() {
    this.isLoading = true;
    const data: AdminMenuModel = {
      ...this.menuForm.value,
      menu_group: +this.selectedMenuId,
    } as AdminMenuModel;

    this.adminService
      .updateAdminMenu(this.id, data)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          const res = response;
          this.isLoading = false;
          if (res.object['success'] !== undefined) {
            this.dialogService.openToast({
              title: '',
              message: res.object.response_message ?? '',
              type: 'failed',
            });
            return;
          }

          this.dialogService.openToast({
            title: '',
            type: 'success',
            message: 'Success',
          });
          this.getAdminMenuDetails();
          this.showUpdateForm = false;
        },
        error: err => {
          this.isLoading = false;
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: err?.object?.response_message ?? 'Failed',
          });
        },
      });
  }

  setSelectedMenu(id: string) {
    this.selectedMenuId = id;
  }

  selectMenu(menu: string) {
    this.selectedMenu = menu;
  }

  refreshData() {
    this.loadingData = true;
    this.menuDetails = null;
    this.getAdminMenuDetails();
  }
  redirectTo(url: string) {
    return `/w/workstation/a/admin/${url}`;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
