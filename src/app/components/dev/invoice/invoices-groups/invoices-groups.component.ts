import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { DialogService, MerchantService } from '../../../../core/services';
import { InvoiceGroupModel, SingleInVoiceModel } from '../invoice.models';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { InvoicesByGroupComponent } from '../invoices-by-group/invoices-by-group.component';
import {
  EmptyStateComponent,
  EmptyStateModel,
} from '../../../../global/components/empty-states/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../global/components/list/pagination/pagination.component';
import { PaginationConfig } from '../../../../global/models/pagination.models';

@Component({
  selector: 'app-invoices-groups',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SkeletonComponent,
    InvoicesByGroupComponent,
    EmptyStateComponent,
    PaginationComponent,
  ],
  templateUrl: './invoices-groups.component.html',
  styleUrl: './invoices-groups.component.scss',
})
export class InvoicesGroupsComponent implements OnInit {
  private OnDestroy$: Subject<void> = new Subject<void>();
  invoices_groups!: InvoiceGroupModel[] | null;
  isSelected_group = false;
  GroupInfo!: InvoiceGroupModel;
  invoices!: SingleInVoiceModel[] | null;
  searchType: EmptyStateModel = 'product';
  invocesPagination: PaginationConfig = {
    filters: {
      limit: 10,
      offset: 0,
    },
  };

  activePage = 1;
  count = 0;
  isLoading = true;

  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getBillsGroup();
    this.router.navigate(['/m/mymarket/invoices-groups']);
  }

  getBillsGroup() {
    this.isLoading = true;
    this.isSelected_group = false;
    this.invoices_groups = null;
    this.merchantService
      .getBillsGroups(this.invocesPagination)
      .pipe(takeUntil(this.OnDestroy$))
      .subscribe({
        next: response => {
          this.invoices_groups = response.objects;
          this.GroupInfo = response.objects[0];
          this.count = response.count;
          this.isLoading = false;
        },
        error: err => {
          this.isLoading = false;
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: err.error.message ?? 'failed to get invoices groups',
          });
        },
      });
  }

  getGoBackEvent(isSelected_group: boolean) {
    this.isSelected_group = isSelected_group;
    this.router.navigate(['/m/mymarket/invoices-groups']);
  }

  onPaginationChange(pagination: PaginationConfig) {
    this.invocesPagination = pagination;
    this.activePage = pagination.filters.offset / pagination.filters.limit + 1;
    this.getBillsGroup();
  }

  getInvoicesByGroup(groupId: number) {
    this.isLoading = true;
    this.invoices = null;
    this.merchantService
      .getBillsByGroup(groupId)
      .pipe(takeUntil(this.OnDestroy$))
      .subscribe({
        next: response => {
          this.invoices = response.objects;
          this.count = response.count;
          this.isSelected_group = true;
          this.isLoading = false;
        },
        error: err => {
          this.isLoading = false;
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: err.error.message ?? 'failed to get invoices',
          });
          err = 'failed to get invoices';
          console.log('hsrfdkjvnserjifod', err);
        },
      });
  }

  selectGroup(groupId: number) {
    this.isLoading = true;
    this.invoices = null;
    this.getInvoicesByGroup(groupId);
    this.isSelected_group = true;
  }
}
