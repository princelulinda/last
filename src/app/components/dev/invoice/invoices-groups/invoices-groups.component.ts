import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { Observable, Subject, takeUntil } from 'rxjs';

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
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';
import { MerchantModel } from '../../../merchant/merchant.models';
import { InvoiceHeaderComponent } from '../invoice-header/invoice-header.component';

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
    AmountVisibilityComponent,
    InvoiceHeaderComponent,
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
  group_name: InvoiceGroupModel | null = null;
  @ViewChild('closeModal') closeModal!: { nativeElement: HTMLElement };
  dialog$: Observable<DialogResponseModel>;
  dialog!: DialogResponseModel;
  openInvoicePopup = false;
  invoice!: SingleInVoiceModel;
  merchant: MerchantModel | null = null;
  is_teller_admin!: boolean;
  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.dialog$ = this.dialogService.getDialogState();
  }

  ngOnInit() {
    this.getBillsGroup();
    this.router.navigate(['/m/mymarket/invoices-groups']);
    this.dialog$.pipe(takeUntil(this.OnDestroy$)).subscribe({
      next: (dialog: DialogResponseModel) => {
        if (dialog) {
          this.dialog = dialog;
          if (this.dialog && this.dialog.response) {
            if (
              this.dialog.action === 'confirm pin' &&
              this.dialog.response.pin
            ) {
              this.validateSingleInvoice();
            }
          }
        }
      },
    });
    this.getConnectedMerchantInfo();
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

  getInvoicesByGroup(group_id: number) {
    this.isLoading = true;
    this.invoices = null;
    this.merchantService
      .getBillsByGroup(group_id)
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
        },
      });
  }

  selectGroup(groupId: InvoiceGroupModel) {
    this.isLoading = true;
    this.GroupInfo = groupId;
    this.getInvoicesByGroup(this.GroupInfo.id);
    this.isSelected_group = true;
  }

  openPopup(singleInvoice: SingleInVoiceModel) {
    if (this.is_teller_admin === true) {
      this.invoice = singleInvoice;
      this.openInvoicePopup = false;
    } else {
      this.openInvoicePopup = true;
      this.dialogService.openToast({
        title: '',
        type: 'failed',
        message: 'this merchant is not teller admin',
      });
    }
  }

  validateSingleInvoice() {
    this.dialogService.dispatchLoading();
    if (this.invoices) {
      const singleInvoiceId = (this.invoice as SingleInVoiceModel).id;
      const body = {
        id: (this.invoice as SingleInVoiceModel).id,
        pin_code: this.dialog.response.pin,
      };
      this.merchantService
        .validateBill(singleInvoiceId, body)
        .pipe(takeUntil(this.OnDestroy$))
        .subscribe({
          next: response => {
            if (response.object.success === true) {
              this.dialogService.closeLoading();
              this.closeModal.nativeElement.click();
              this.selectGroup(this.GroupInfo);
              this.dialogService.openToast({
                title: '',
                type: 'success',
                message:
                  response.object.response_message ??
                  'validated single invoice successful',
              });
            } else {
              this.dialogService.closeLoading();
              this.closeModal.nativeElement.click();
              this.dialogService.openToast({
                title: '',
                type: 'failed',
                message:
                  response.object.response_message ??
                  'Something went wrong, please try again',
              });
            }
          },
          error: msg => {
            this.dialogService.closeLoading();
            this.closeModal.nativeElement.click();
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message:
                msg?.object?.response_message ??
                'Something went wrong, please try again',
            });
          },
        });
    }
  }

  enterPin() {
    this.dialogService.openDialog({
      type: 'pin',
      title: '',
      message: 'Please enter your pin to continue',
      action: 'confirm pin',
    });
  }

  getConnectedMerchantInfo() {
    this.merchant = null;
    this.merchantService
      .getConnectedMerchantInfo()
      .pipe(takeUntil(this.OnDestroy$))
      .subscribe({
        next: data => {
          this.merchant = data.object.response_data;
          this.is_teller_admin = this.merchant.is_teller_admin;
        },
        error: () => {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'Something went wrong, please try again',
          });
        },
      });
  }
}
