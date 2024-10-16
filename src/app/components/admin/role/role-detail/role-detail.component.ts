import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { DialogService } from '../../../../core/services';
import { VariableService } from '../../../../core/services/variable/variable.service';
import { ListComponent } from '../../../../global/components/list/list/list.component';
import { AutocompleteModel } from '../../../../global/models/global.models';
import { RoleMenuModel, RoleModel } from '../role.models';
import { MultiSelectComponent } from '../../../../global/components/custom-field/multi-select/multi-select.component';
import { PageMenusModel } from '../../menu/menu.models';
import { MenuService } from '../../../../core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-detail',
  standalone: true,
  imports: [
    RouterLink,
    ListComponent,
    ReactiveFormsModule,
    CommonModule,
    MultiSelectComponent,
  ],
  templateUrl: './role-detail.component.html',
  styleUrl: './role-detail.component.scss',
})
export class RoleDetailComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  roleId!: string;
  roleDetails!: RoleModel | null;
  roleMenuIds: number[] = [];

  url = '';
  headers = [
    {
      name: 'Name',
      field: ['menu.name'],
      size: '',
      icon: 'menu.icon',
      detail: {
        link: '/w/workstation/a/admin/menu/',
        field: 'menu.id',
      },
    },
    {
      name: 'Url',
      field: ['menu.component_url'],
      size: '4',
    },
    {
      name: 'Group',
      field: [
        'menu.menu_group_info.name',
        'menu.menu_group_info.menu_group_type.title',
      ],
      size: '',
    },
    {
      name: 'Active',
      field: ['menu.active'],
      size: '',
      boolean: true,
    },
  ];

  selectedMenu: 'detail' | 'menus' | 'newMenu' = 'detail';
  showRoleForm = false;
  isLoading = false;
  loadingData = true;
  errorMessage = '';

  role!: FormControl;
  roleType!: FormControl;
  is_active!: FormControl;

  menuArr: AutocompleteModel[] | null = [];
  private pageMenus: PageMenusModel[] = [];
  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private variableService: VariableService,
    private menuService: MenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.route && this.route.fragment) {
      this.route.fragment.subscribe({
        next: fragment => {
          switch (fragment) {
            case 'menus':
              this.selectedMenu = 'menus';
              break;

            case 'newMenu':
              this.selectedMenu = 'newMenu';
              break;

            case null:
            default:
              this.selectedMenu = 'detail';
              break;
          }
        },
      });
    }

    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: params => {
        this.roleId = params['id'];
        this.url = `/hr/access/menu/roles/?role=${this.roleId}&`;
        this.getRoleDetails();
        this.getRoleMenus();
        this.pageMenus = [
          {
            icon: 'circle-info',
            title: 'Role Details',

            url: `/w/workstation/a/admin/role/${this.roleId}`,
          },

          {
            icon: 'fa-solid fa-list-ul',
            title: ' Menus',
            fragment: 'menus',
            url: `/w/workstation/a/admin/role/${this.roleId}`,
          },

          {
            icon: 'fa-solid fa-plus',
            title: 'Add New Menu',
            fragment: 'newMenu',
            url: `/w/workstation/a/admin/role/${this.roleId}`,
          },
        ];
      },
    });

    this.menuService.setPageMenus(this.pageMenus);
  }

  getRoleDetails() {
    this.adminService
      .getRoleDetails(this.roleId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const res = data;

          this.roleDetails = res.object;
          this.role = new FormControl(res.object.content_object.value);
          this.roleType = new FormControl(res.object.role_type.title);
          this.is_active = new FormControl(res.object.is_active);

          this.loadingData = false;
          this.showRoleForm = false;
        },
        error: error => {
          this.loadingData = false;
          this.errorMessage = `Data not found`;
          return error;
        },
      });
  }

  goBack() {
    this.router.navigate(['/w/workstation/a/admin/role', this.roleId], {
      fragment: 'menus',
    });
  }

  getRoleMenus() {
    this.adminService
      .getRoleMenus(this.roleId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const res = data;
          this.roleMenuIds = this.getAllIds(res.objects, 'menu.id');
        },
        error: error => {
          return error;
        },
      });
  }

  assignRoleMenus() {
    this.isLoading = true;
    const body = {
      menus: this.menuArr as AutocompleteModel[],
    };

    this.adminService.assignRoleMenus(this.roleId, body).subscribe({
      next: data => {
        this.isLoading = false;
        this.getRoleMenus();
        this.dialogService.openToast({
          title: '',
          message: 'Success',
          type: 'success',
        });

        this.router.navigate(['/w/workstation/a/admin/role', this.roleId], {
          fragment: 'menus',
        });

        return data;
      },
      error: err => {
        this.isLoading = false;
        this.dialogService.openToast({
          title: '',
          message: 'Failed',
          type: 'failed',
        });
        return err;
      },
    });
  }

  menusSelected(menus: AutocompleteModel[] | null) {
    this.menuArr = menus;
  }

  redirectTo(url: string) {
    return `/w/workstation/a/admin/${url}`;
  }

  refreshData() {
    this.roleDetails = null;
    this.loadingData = true;
    this.getRoleDetails();
  }

  private getAllIds(data: RoleMenuModel[], path: string): number[] {
    const ids: number[] = [];
    const fields: (keyof RoleMenuModel)[] = path.split(
      '.'
    ) as (keyof RoleMenuModel)[];

    for (const item of data) {
      let temp: RoleMenuModel | number = item;

      for (const field of fields) {
        if (typeof temp === 'object' && temp !== null && field in temp) {
          temp = temp[field] as RoleMenuModel | number;
        } else {
          temp = NaN;
          break;
        }
      }

      if (typeof temp === 'number' && !isNaN(temp)) {
        ids.push(temp);
      }
    }

    return ids;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
