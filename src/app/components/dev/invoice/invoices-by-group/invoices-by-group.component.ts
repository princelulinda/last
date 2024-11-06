import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../../global/components/empty-states/empty-state/empty-state.component';
import { InvoiceGroupModel, SingleInVoiceModel } from '../invoice.models';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { DialogService, MerchantService } from '../../../../core/services';
import { PaginationConfig } from '../../../../global/models/pagination.models';
import { PaginationComponent } from '../../../../global/components/list/pagination/pagination.component';
import { MerchantModel } from '../../../merchant/merchant.models';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-invoices-by-group',
  standalone: true,
  imports: [
    RouterLink,
    SkeletonComponent,
    EmptyStateComponent,
    AmountVisibilityComponent,
    PaginationComponent,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './invoices-by-group.component.html',
  styleUrl: './invoices-by-group.component.scss',
})
export class InvoicesByGroupComponent implements OnInit, OnDestroy {
  private OnDestroy$: Subject<void> = new Subject<void>();
  @ViewChild('closeModal') closeModal!: { nativeElement: HTMLElement };
  group!: InvoiceGroupModel | null;
  invoices!: SingleInVoiceModel[] | null;
  invoice!: SingleInVoiceModel;
  count!: number;
  isSelected_group = false;
  groupId!: number;
  isLoading = true;
  invocesPagination: PaginationConfig = {
    filters: {
      limit: 10,
      offset: 0,
    },
  };
  activePage = 1;
  is_teller_admin!: boolean;
  openInvoicePopup = false;
  merchant: MerchantModel | null = null;
  searchInvoiceByGroup = new FormControl('');
  isInputFocused = false;
  dialog$: Observable<DialogResponseModel>;
  dialog!: DialogResponseModel;

  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dialog$ = this.dialogService.getDialogState();
  }

  ngOnInit() {
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
    if (this.route.params) {
      this.route.params.subscribe({
        next: data => {
          this.groupId = data['id'];
          this.getInvoicesByGroup('');
        },
      });
    }
    this.searchInvoiceByGroup.valueChanges
      .pipe(debounceTime(400), takeUntil(this.OnDestroy$))
      .subscribe(value => {
        this.getInvoicesByGroup(value ?? '');
      });

    this.getConnectedMerchantInfo();
  }

  getInvoicesByGroup(search: string) {
    this.isLoading = true;
    this.isSelected_group = true;
    this.invoices = null;
    this.merchantService
      .getBillsByGroup(this.groupId, search)
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
              this.getInvoicesByGroup('');
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

  getGoBackEvent() {
    this.isSelected_group = false;
    this.router.navigate(['/m/mymarket/invoices-groups']);
  }

  onPaginationChange(pagination: PaginationConfig) {
    this.invocesPagination = pagination;
    this.activePage = pagination.filters.offset / pagination.filters.limit + 1;
    this.getInvoicesByGroup('');
  }

  enterPin() {
    this.dialogService.openDialog({
      type: 'pin',
      title: '',
      message: 'Please enter your pin to continue',
      action: 'confirm pin',
    });
  }

  isSearchInvoiceNotEmpty(): boolean {
    const searchValue = this.searchInvoiceByGroup.value;
    return typeof searchValue === 'string' && searchValue.trim() !== '';
  }

  onSearchInvoiceEnter(event: Event) {
    event.preventDefault();
    const searchValue = this.searchInvoiceByGroup.value;
    this.getInvoicesByGroup(searchValue ?? '');
  }

  ngOnDestroy() {
    this.OnDestroy$.next();
    this.OnDestroy$.complete();
  }
}
