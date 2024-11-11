import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ConfigService,
  DialogService,
  MerchantService,
} from '../../../../core/services';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { SingleInVoiceModel } from '../invoice.models';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { PaginationConfig } from '../../../../global/models/pagination.models';
import { PaginationComponent } from '../../../../global/components/list/pagination/pagination.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';
import { EmptyStateComponent } from '../../../../global/components/empty-states/empty-state/empty-state.component';
import { MerchantModel } from '../../../merchant/merchant.models';
import {
  ActiveMainConfigModel,
  PlateformModel,
} from '../../../../core/services/config/main-config.models';

@Component({
  selector: 'app-single-invoices',
  standalone: true,
  imports: [
    RouterLink,
    AmountVisibilityComponent,
    PaginationComponent,
    ReactiveFormsModule,
    EmptyStateComponent,
    NgClass,
  ],
  templateUrl: './single-invoices.component.html',
  styleUrl: './single-invoices.component.scss',
})
export class SingleInvoicesComponent implements OnInit, OnDestroy {
  @ViewChild('closeModal') closeModal!: { nativeElement: HTMLElement };
  private onDestroy$: Subject<void> = new Subject<void>();
  singleInvoices!: SingleInVoiceModel[] | null;
  merchantId!: string | number;
  pagination: PaginationConfig = {
    filters: {
      limit: 10,
      offset: 0,
    },
  };
  response_data = 0;
  loader = true;
  activePage = 1;
  searchInput = new FormControl('');
  isInputFocused = false;
  openInvoicePopup = false;
  selectedInvoice: SingleInVoiceModel | null = null;

  dialog$: Observable<DialogResponseModel>;
  dialog!: DialogResponseModel;
  merchant: MerchantModel | null = null;
  is_teller_admin!: boolean;
  activePlatform!: PlateformModel;
  mainConfig$!: Observable<ActiveMainConfigModel>;

  constructor(
    private route: ActivatedRoute,
    private merchantService: MerchantService,
    private dialogService: DialogService,
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
    this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
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
      this.route.params.subscribe(params => {
        this.merchantId = params['id'];
      });
    }

    this.searchInput.valueChanges
      .pipe(debounceTime(400), takeUntil(this.onDestroy$))
      .subscribe(value => {
        this.getSingleInvoices(value ?? '');
      });

    this.getConnectedMerchantInfo();
  }

  getConnectedMerchantInfo() {
    this.merchant = null;
    this.merchantService
      .getConnectedMerchantInfo()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.merchant = data.object.response_data;
          this.is_teller_admin = this.merchant.is_teller_admin;
          this.merchantId = this.merchant.id;
          this.getSingleInvoices('');
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

  getSingleInvoices(search: string) {
    this.loader = true;
    this.singleInvoices = null;
    this.merchantService
      .getSingleInvoices(this.pagination, search, this.merchantId as number)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.loader = false;
          this.singleInvoices = response.objects.filter(
            invoice => invoice.provider
          );
          this.response_data = this.singleInvoices.length;
        },
        error: () => {
          this.loader = false;
        },
      });
  }
  onPaginationChange(pagination: PaginationConfig) {
    this.pagination = pagination;
    this.activePage = pagination.filters.offset / pagination.filters.limit + 1;
    this.getSingleInvoices('');
  }

  isSearchInputNotEmpty(): boolean {
    const searchValue = this.searchInput.value;
    return typeof searchValue === 'string' && searchValue.trim() !== '';
  }

  onSearchEnter(event: Event) {
    event.preventDefault();
    const searchValue = this.searchInput.value;
    this.getSingleInvoices(searchValue ?? '');
  }

  openPopup(singleInvoice: SingleInVoiceModel) {
    if (this.is_teller_admin === true) {
      this.selectedInvoice = singleInvoice;
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
    if (this.selectedInvoice) {
      const singleInvoiceId = (this.selectedInvoice as SingleInVoiceModel).id;
      const body = {
        id: (this.selectedInvoice as SingleInVoiceModel).id,
        pin_code: this.dialog.response.pin,
      };
      this.merchantService
        .validateBill(singleInvoiceId, body)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: response => {
            if (response.object.success === true) {
              this.dialogService.closeLoading();
              this.closeModal.nativeElement.click();
              this.getSingleInvoices('');
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

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
