import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { debounceTime, Subject, takeUntil } from 'rxjs';

import { DialogService, MerchantService } from '../../../../core/services';
import { InvoiceGroupModel } from '../invoice.models';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { InvoicesByGroupComponent } from '../invoices-by-group/invoices-by-group.component';
import {
  EmptyStateComponent,
  EmptyStateModel,
} from '../../../../global/components/empty-states/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../global/components/list/pagination/pagination.component';
import { PaginationConfig } from '../../../../global/models/pagination.models';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoices-groups',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    RouterLink,
    SkeletonComponent,
    InvoicesByGroupComponent,
    EmptyStateComponent,
    PaginationComponent,
    AmountVisibilityComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './invoices-groups.component.html',
  styleUrl: './invoices-groups.component.scss',
})
export class InvoicesGroupsComponent implements OnInit, OnDestroy {
  private OnDestroy$: Subject<void> = new Subject<void>();
  invoices_groups!: InvoiceGroupModel[] | null;
  isSelected_group = false;
  GroupInfo!: InvoiceGroupModel;
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
  searchGroup = new FormControl('');
  isInputFocused = false;

  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getBillsGroup('');
    this.router.navigate(['/m/mymarket/invoices-groups']);
    this.searchGroup.valueChanges
      .pipe(debounceTime(400), takeUntil(this.OnDestroy$))
      .subscribe(value => {
        this.getBillsGroup(value ?? '');
      });
  }

  getBillsGroup(search: string) {
    this.isLoading = true;
    this.isSelected_group = false;
    this.invoices_groups = null;
    this.merchantService
      .getBillsGroups(this.invocesPagination, search)
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

  isSearchGroupNotEmpty(): boolean {
    const searchValue = this.searchGroup.value;
    return typeof searchValue === 'string' && searchValue.trim() !== '';
  }

  onPaginationChange(pagination: PaginationConfig) {
    this.invocesPagination = pagination;
    this.activePage = pagination.filters.offset / pagination.filters.limit + 1;
    this.getBillsGroup('');
  }

  selectGroup(groupId: InvoiceGroupModel) {
    this.isLoading = true;
    this.GroupInfo = groupId;
    this.router.navigate(['/m/mymarket/group/' + this.GroupInfo.id]);
    this.isSelected_group = true;
  }

  onEnter(event: Event) {
    event.preventDefault();
    const searchValue = this.searchGroup.value;
    this.getBillsGroup(searchValue ?? '');
  }
  ngOnDestroy() {
    this.OnDestroy$.next();
    this.OnDestroy$.complete();
  }
}
