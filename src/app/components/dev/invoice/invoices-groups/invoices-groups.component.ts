import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';

import {
  ConfigService,
  DialogService,
  MerchantService,
} from '../../../../core/services';
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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  ActiveMainConfigModel,
  PlateformModel,
} from '../../../../core/services/config/main-config.models';

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
  invoices!: SingleInVoiceModel[] | null;
  searchType: EmptyStateModel = 'product';
  invocesPagination: PaginationConfig = {
    filters: {
      limit: 12,
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
  searchGroup = new FormControl('');
  searchInvoiceByGroup = new FormControl('');
  isInputFocused = false;
  activePlatform!: PlateformModel;
  mainConfig$!: Observable<ActiveMainConfigModel>;

  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService,
    private router: Router,
    private configService: ConfigService
  ) {
    this.dialog$ = this.dialogService.getDialogState();
    this.mainConfig$ = this.configService.getMainConfig();
  }

  ngOnInit() {
    this.mainConfig$.subscribe({
      next: configs => {
        if (configs) {
          this.activePlatform = configs.activePlateform;
        }
      },
    });
    this.getBillsGroup('');
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
    this.searchGroup.valueChanges
      .pipe(debounceTime(400), takeUntil(this.OnDestroy$))
      .subscribe(value => {
        this.getBillsGroup(value ?? '');
      });

    this.searchInvoiceByGroup.valueChanges
      .pipe(debounceTime(400), takeUntil(this.OnDestroy$))
      .subscribe(value => {
        this.getInvoicesByGroup(this.GroupInfo.id, value ?? '');
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

  isSearchInvoiceNotEmpty(): boolean {
    const searchValue = this.searchInvoiceByGroup.value;
    return typeof searchValue === 'string' && searchValue.trim() !== '';
  }

  getGoBackEvent() {
    this.isSelected_group = false;
    if (this.activePlatform !== 'workstation') {
      this.router.navigate(['/m/mymarket/invoices-groups']);
    }
  }

  onPaginationChange(pagination: PaginationConfig) {
    this.invocesPagination = pagination;
    this.activePage = pagination.filters.offset / pagination.filters.limit + 1;
    this.getBillsGroup('');
  }

  getInvoicesByGroup(group_id: number, search: string) {
    this.isLoading = true;
    this.invoices = null;
    this.merchantService
      .getBillsByGroup(group_id, search)
      .pipe(takeUntil(this.OnDestroy$))
      .subscribe({
        next: response => {
          this.invoices = response.objects;
          this.count = response.count;
          this.isSelected_group = true;
          this.isLoading = false;
        },
        error: err => {
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
    this.getInvoicesByGroup(this.GroupInfo.id, '');
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
  onEnter(event: Event) {
    event.preventDefault();
    const searchValue = this.searchGroup.value;
    this.getBillsGroup(searchValue ?? '');
  }
  onSearchInvoiceEnter(event: Event) {
    event.preventDefault();
    const searchValue = this.searchInvoiceByGroup.value;
    this.getInvoicesByGroup(this.GroupInfo.id, searchValue ?? '');
  }
  ngOnDestroy() {
    this.OnDestroy$.next();
    this.OnDestroy$.complete();
  }
}
