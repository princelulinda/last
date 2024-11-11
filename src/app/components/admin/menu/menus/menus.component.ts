import { Component, OnInit } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { DialogService } from '../../../../core/services';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminMenuBodyModel } from '../menu.models';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [
    ListComponent,
    LookupComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss',
})
export class MenusComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  isLoading = false;
  menuForm = this.fb.group({
    name: ['', Validators.required],
    component_url: [''],
    mobile_url: [''],
    fragment: [''],
    icon: ['', Validators.required],
    active: [false],
  });

  selectedMenuId!: number;

  showList = true;

  headers = [
    {
      name: 'Name',
      field: ['name'],
      size: '',
      icon: 'icon',
      detail: {
        link: '/w/workstation/a/admin/menu/',
        field: 'id',
      },
      format: '',
    },
    {
      name: 'URL',
      field: ['component_url'],
      size: '3',
      format: '',
    },
    {
      name: 'Fragment',
      field: ['fragment'],
      size: '',
    },
    {
      name: 'Group',
      field: ['menu_group_info.name', 'menu_group_info.menu_group_type.title'],
      size: '',
    },
    {
      name: 'Active',
      field: ['active'],
      size: '2',
      boolean: true,
      format: '',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.route && this.route.fragment) {
      this.route.fragment.subscribe({
        next: fragment => {
          switch (fragment) {
            case 'newMenu':
              this.showList = false;
              break;
            case null:
            default:
              this.showList = true;
              break;
          }
        },
      });
    }
  }

  submitAdminMenu() {
    this.isLoading = true;
    const body = {
      ...this.menuForm.value,
      menu_group: this.selectedMenuId,
      color: 'dark',
    } as AdminMenuBodyModel;
    this.adminService
      .setAdminMenu(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.isLoading = false;

          // if (
          //   response.object['success'] !== undefined &&
          //   !response.object.success
          // ) {
          //   this.dialogService.openToast({
          //     title: '',
          //     message: response.object.response_message as string,
          //     type: 'failed',
          //   });
          //   return;
          // }

          // ##################################### TO CHECK #########################
          if (response.object.response_message) {
            this.dialogService.openToast({
              title: '',
              message: response.object.response_message,
              type: 'failed',
            });
            return;
          }
          // ########################################################################
          this.menuForm.reset();
          this.router.navigate([], {
            relativeTo: this.route,
            fragment: undefined,
            queryParamsHandling: 'preserve',
          });
          this.dialogService.openToast({
            title: '',
            type: 'success',
            message: 'success',
          });
        },
        error: () => {
          this.isLoading = false;
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'Failed',
          });
        },
      });
  }

  setSelectedMenuId(id: number | undefined) {
    this.selectedMenuId = id as number;
  }
}
