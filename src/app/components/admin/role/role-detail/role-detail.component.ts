import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DialogService } from '../../../../core/services';
import { VariableService } from '../../../../core/services/variable/variable.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from '../../../../global/components/list/list.component';
import { CommonModule } from '@angular/common';
import { RoleMenuModel, RoleModel } from '../../operator/operator.models';
import { MultiSelectComponent } from '../../../dev/multi-select/multi-select.component';
import { AutocompleteModel } from '../../../../global/models/global.models';

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
        link: '/w/workstation/admin/menu/',
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

  selectedMenu = 'details';
  showRoleForm = false;
  isLoading = false;
  loadingData = true;
  errorMessage = '';

  role!: FormControl;
  roleType!: FormControl;
  is_active!: FormControl;

  menus: AutocompleteModel[] | null = [];

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private variableService: VariableService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: params => {
        this.roleId = params['id'];
        this.url = `/hr/access/menu/roles/?role=${this.roleId}&`;
        this.getRoleDetails();
        this.getRoleMenus();
      },
    });
  }

  getRoleDetails() {
    this.adminService
      .getRoleDetails(this.roleId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const res = data as { object: RoleModel };
          console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', res.object);

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

  getRoleMenus() {
    this.adminService
      .getRoleMenus(this.roleId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const res = data as { objects: RoleMenuModel[] };
          console.log('######################', res);
          this.roleMenuIds = this.getAllIds(res.objects, 'menu.id');
          console.log(
            '!!!!!!!!!!!!!!!!!!!!!!!11111111111111111111111111',
            this.roleMenuIds
          );
        },
        error: error => {
          return error;
        },
      });
  }

  assignRoleMenus() {
    this.isLoading = true;
    const body = {
      menus: this.menus as AutocompleteModel[],
    };

    console.log('Body of Assign Role Menus:', body);

    this.adminService.assignRoleMenus(this.roleId, body).subscribe({
      next: data => {
        this.isLoading = false;
        this.getRoleMenus();
        this.dialogService.openToast({
          title: '',
          message: 'Success',
          type: 'success',
        });
        this.selectMenu('menus');
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
    this.menus = menus;
  }

  selectMenu(name: string) {
    this.selectedMenu = name;
  }

  redirectTo(url: string) {
    return `/w/workstation/admin/${url}`;
  }

  refreshData() {
    this.roleDetails = null;
    this.loadingData = true;
    this.getRoleDetails();
  }

  // private getAllIds(data: RoleMenuModel[], path: string) {
  //   const ids: number[] = [];
  //   const fields: string[] = path.split('.');
  //   console.log('Fields:', fields);
  //   for (const item of data) {
  //     let temp: RoleMenuModel | number = item;
  //     for (const field of fields) {
  //       temp = (temp as RoleMenuModel)[field as keyof RoleMenuModel]
  //     }
  //     ids.push(temp as number);
  //   }
  //   return ids;
  // }

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
