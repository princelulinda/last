import { Component, OnInit, OnDestroy } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DialogService, MenuService } from '../../../../core/services';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemModel } from '../../../../global/components/lookups/lookup/lookup.model';
import { NewOperatorModel } from '../operator.models';

@Component({
  selector: 'app-operators',
  standalone: true,
  imports: [ListComponent, CommonModule, LookupComponent, ReactiveFormsModule],
  templateUrl: './operators.component.html',
  styleUrl: './operators.component.scss',
})
export class OperatorsComponent implements OnInit, OnDestroy {
  selectedList: 'operators' | 'invitations' | 'newOperator' = 'operators';
  headers = [
    {
      name: 'Username',
      field: ['operator.username'],
      size: '',
    },
    {
      name: 'Teller',
      field: ['is_teller'],
      size: '',
      boolean: true,
    },
    {
      name: 'Treasurer',
      field: ['is_treasurer'],
      size: '',
      boolean: true,
    },
    {
      name: 'Organization',
      field: ['organization.institution_client.client_full_name'],
      size: '',
    },
    {
      name: 'Active',
      field: ['organization.is_active'],
      size: '',
      boolean: true,
    },
    {
      name: 'Status',
      field: ['status.title'],
      size: '',
      css: 'status.css',
      class: 'badge',
    },
  ];
  operatorHeader = [
    {
      name: 'Name',
      field: ['operator.name'],
      size: '',
      detail: {
        link: '/w/workstation/a/admin/operators/',
        field: 'id',
      },
    },
    ...this.headers,
  ];

  invitationsHeader = [
    {
      name: 'Name',
      field: ['operator.name'],
      size: '',
    },
    ...this.headers,
  ];

  pagesMenus = [
    {
      icon: 'list-ul',
      title: 'Operators List',
      url: '/w/workstation/a/admin/operators',
    },
    {
      icon: 'user-clock',
      title: 'Invitations',
      url: '/w/workstation/a/admin/operators',
      fragment: 'invitations',
    },
  ];

  private onDestroy$: Subject<void> = new Subject<void>();
  clientId: number | null = null;
  isLoading = false;

  pin = new FormControl('', [Validators.required]);

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private adminService: AdminService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.route && this.route.fragment) {
      this.route.fragment.subscribe({
        next: fragment => {
          switch (fragment) {
            case 'invitations':
              this.selectedList = 'invitations';
              break;
            case 'newOperator':
              this.selectedList = 'newOperator';
              break;
            case null:
            default:
              this.selectedList = 'operators';
              break;
          }
        },
      });
    }
    this.menuService.setPageMenus(this.pagesMenus);
  }

  selectClient($event: ItemModel | null) {
    this.clientId = $event ? $event.id : null;
  }

  createNewOperator() {
    this.isLoading = true;
    const body = {
      client: this.clientId as number,
      pin_code: parseInt(this.pin.value as string),
    };

    this.adminService
      .createOperator(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: res => {
          const response = res as { object: NewOperatorModel };
          this.isLoading = false;
          this.clientId = null;
          this.pin.reset();
          if (response.object.success === false) {
            this.dialogService.openToast({
              message: response.object.response_message,
              title: '',
              type: 'failed',
            });
            this.isLoading = false;
            return;
          }

          this.dialogService.openToast({
            title: '',
            message: 'Success',
            type: 'success',
          });
          this.router.navigate(['/w/workstation/a/admin/operators'], {
            fragment: 'invitations',
          });
        },
        error: err => {
          this.isLoading = false;
          this.pin.reset();
          this.dialogService.openToast({
            message: 'Failed',
            title: '',
            type: 'failed',
          });
          return err;
        },
      });
  }

  ngOnDestroy() {
    this.menuService.destroyPageMenus();
  }
}
