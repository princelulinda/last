import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Observable, Subject, takeUntil } from 'rxjs';

import { MerchantService } from '../../../core/services/merchant/merchant.service';
import {
  AuthService,
  ConfigService,
  MenuService,
} from '../../../core/services';
import { DialogService } from '../../../core/services';

import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import {
  DialogResponseModel,
  MerchantBillModel,
} from '../../../core/services/dialog/dialogs-models';
import { UserInfoModel } from '../../../core/db/models/auth';
import { AmountFieldComponent } from '../../../global/components/custom-field/amount-field/amount-field.component';
import { LookupComponent } from '../../../global/components/lookups/lookup/lookup.component';
import {
  activeMainConfigModel,
  ModeModel,
  PlateformModel,
} from '../../../core/services/config/main-config.models';
import { MerchantCardComponent } from '../../merchant/global/merchant-card/merchant-card.component';
import { MerchantBillComponent } from '../../../global/components/popups/bills-format/merchant-bill/merchant-bill.component';
import { AllProductsComponent } from '../../merchant/products/all-products/all-products.component';
import { StatementComponent } from '../../statements/statement/statement.component';
import {
  MerchantAutocompleteModel,
  MerchantModel,
  MerchantStatsModel,
} from '../../merchant/merchant.models';
import { ReusableListComponent } from '../../../global/components/list/reusable-list/reusable-list.component';
import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import {
  MenuSimpleModel,
  TypeMenuModel,
} from '../../../core/db/models/menu/menu.models';
import { LookupModel } from '../../../global/models/global.models';

@Component({
  selector: 'app-my-market-dashboard',
  standalone: true,
  imports: [
    SkeletonComponent,
    CommonModule,
    AllProductsComponent,
    LookupComponent,
    AmountFieldComponent,
    RouterLink,
    MerchantCardComponent,
    ReactiveFormsModule,
    FormsModule,
    MerchantBillComponent,
    ReusableListComponent,
    StatementComponent,
    AmountVisibilityComponent,
  ],
  templateUrl: './my-market-dashboard.component.html',
  styleUrl: './my-market-dashboard.component.scss',
})
export class MyMarketDashboardComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  baseMenuUrl = '/w/workstation/m/market/';

  clientInfo: UserInfoModel[] | [] | null = null;
  clientInfo$: Observable<UserInfoModel>;
  amount: string | number | null = 0;
  selectedClient!: LookupModel | null;
  isLoadingInfo = false;

  merchantId!: string | number;
  merchant!: MerchantModel | null;
  merchantMult!: MerchantAutocompleteModel[];
  merchantInfo!: MerchantModel | null;

  stat!: MerchantStatsModel | null;
  account!: {
    acc_holder: string;
    acc_number: string;
  };
  merchantAccountId = '';
  billForm = new FormGroup({
    description: new FormControl(''),
    amount: new FormControl(0, Validators.required),
  });
  dialog!: DialogResponseModel;
  dialog$: Observable<DialogResponseModel>;

  isLoading = false;
  openBillPopup = false;
  isMerchantPopupOpened = false;
  @ViewChild('closeModal') closeModal!: { nativeElement: HTMLElement };
  @ViewChild('closeMerchantsModal') closeMerchantsModal!: {
    nativeElement: HTMLElement;
  };

  successMessage!: MerchantBillModel;
  pin = '';
  indexMerchant = 0;
  theme!: ModeModel;
  theme$: Observable<ModeModel>;
  activePlatform!: PlateformModel;
  mainConfig$!: Observable<activeMainConfigModel>;

  corporateMarketMenus: MenuSimpleModel[] = [];
  menus$: Observable<TypeMenuModel[]>;
  marketMenus: MenuSimpleModel[] = [
    {
      component_url: 'product-config',
      id: 1,
      name: `Manage product`,
      icon: 'box',
      signature: '',
    },
    {
      component_url: 'payment-reports',
      id: 2,
      name: `Payment reports`,
      icon: 'file-excel',
      signature: '',
    },
    {
      component_url: 'merchant-config',
      id: 3,
      name: `Merchant config`,
      icon: 'sliders',
      signature: '',
    },
    {
      component_url: '',
      id: 4,
      name: `Statements`,
      icon: 'history',
      signature: '',
    },
    {
      component_url: 'merchant-transfer',
      id: 5,
      name: `Transfer`,
      icon: 'paper-plane',
      signature: '',
    },
    {
      component_url: '',
      id: 6,
      name: `Generate Bill`,
      icon: 'file-invoice',
      signature: '',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private merchantService: MerchantService,
    private authService: AuthService,
    private dialogService: DialogService,
    private configService: ConfigService,
    private menuService: MenuService
  ) {
    this.clientInfo$ = this.authService.getUserInfo();
    this.dialog$ = this.dialogService.getDialogState();
    this.theme$ = this.configService.getMode();
    this.mainConfig$ = this.configService.getMainConfig();
    this.menus$ = this.configService.getTypeMenus();
  }

  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        if (configs) {
          this.activePlatform = configs.activePlateform;
        }
      },
    });

    if (this.route.params) {
      this.route.params.subscribe({
        next: data => {
          this.merchantId = data['id'];
        },
      });
    }

    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
    });

    this.menus$.subscribe({
      next: menus => {
        if (menus) {
          [this.corporateMarketMenus] = this.menuService.getBankingMenu(
            'market',
            'Dashboard',
            this.configService.toArray(menus)
          );
        }
      },
    });

    this.getConnectedMerchantInfo();
    this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (dialog: DialogResponseModel) => {
        if (dialog) {
          this.dialog = dialog;
          if (this.dialog && this.dialog.response) {
            if (
              this.dialog.action === 'confirm pin' &&
              this.dialog.response.pin
            ) {
              this.pin = dialog.response.pin;
              this.generateBill();
            }
          }
        }
      },
    });
    this.getMerchantMultipleInfo();
  }

  enterPin() {
    this.dialogService.openDialog({
      type: 'pin',
      title: '',
      message: 'Please enter your pin to continue',
      action: 'confirm pin',
    });
  }
  openPopup() {
    this.openBillPopup = false;
  }
  openMerchantsPopup() {
    this.isMerchantPopupOpened = false;
  }
  generateBill() {
    this.openBillPopup = true;

    const body = {
      amount: this.billForm.value.amount,
      client: (this.selectedClient as LookupModel).id,
      description: this.billForm.value.description,
      merchant_id: this.merchantId,
      pin_code: this.pin,
    };
    this.dialogService.dispatchLoading();

    this.merchantService
      .generateBill(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          if (
            response.object['success'] !== undefined &&
            !response.object.success
          ) {
            this.dialogService.closeLoading();
            this.pin = '';

            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: response.object.response_message,
            });
            return;
          }
          this.successMessage = {
            debit_account: '',
            name: (this.selectedClient as LookupModel).lookup_title,
            merchantName: (this.merchant as MerchantModel).client
              .client_full_name,

            date: Date.now(),
            printable_text: '',
            amount: this.amount,
            code: (this.merchant as MerchantModel).merchant_code,
            product: {
              name: '',
              value: '',
            },
            description: this.billForm.value.description as string,
            adress: '',
            // receipt_date: '',
            credit_account: (this.merchant as MerchantModel).merchant_code,
          };
          this.openBillPopup = false;

          this.billForm.reset();
          this.selectedClient = null;
          this.amount = null;
          this.amount = 0;
          this.dialogService.closeLoading();
          this.pin = '';

          this.dialogService.openToast({
            title: '',
            type: 'success',
            message: response.object.response_message,
          });
          this.dialogService.openMerchantBillPopup(this.successMessage);
          this.closeModal.nativeElement.click();
          this.billForm.reset();
        },
        error: msg => {
          this.dialogService.closeLoading();
          this.pin = '';

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
  selectClient(event: LookupModel | null) {
    if (event) {
      this.selectedClient = event;
    } else {
      this.selectedClient = null;
    }
  }

  getConnectedMerchantInfo() {
    this.isLoadingInfo = true;

    this.merchantService
      .getConnectedMerchantInfo()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.isLoadingInfo = false;

          this.merchant = data.object.response_data;
          this.account = {
            acc_holder: this.merchant.merchant_title,
            acc_number: this.merchant.merchant_main_account,
          };
          this.merchantAccountId = (
            this.merchant as MerchantModel
          ).merchant_main_account_id;
          this.merchantId = this.merchant.id;

          this.getMerchantInfos();
          this.getMerchantStats();
        },
        error: () => {
          this.isLoadingInfo = false;
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'something went wrong, please try again',
          });
        },
      });
  }
  getMerchantInfos() {
    this.merchantService
      .getMerchantInfos(this.merchantId as string)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.merchantInfo = data.object.response_data;
          this.merchantId = (this.merchantInfo as MerchantModel).id;

          this.getMerchantStats();
        },
        error: () => {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'something went wrong, please try again',
          });
        },
      });
  }
  getMerchantMultipleInfo() {
    this.merchantService
      .getMerchantMultipleInfo()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.merchantMult = data.objects;
        },
        error: () => {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'something went wrong, please try again',
          });
        },
      });
  }

  switchMerchant(merchantId: number | string) {
    this.isMerchantPopupOpened = true;
    this.merchantId = merchantId;

    this.isLoadingInfo = true;
    this.merchant = null;
    this.merchantInfo = null;
    this.stat = null;
    this.closeMerchantsModal.nativeElement.click();

    this.merchantService.getMerchantInfos(merchantId as string).subscribe({
      next: data => {
        this.isMerchantPopupOpened = false;
        this.isLoadingInfo = false;
        this.merchant = data.object.response_data;
        this.getMerchantInfos();
      },
      error: () => {
        this.dialogService.openToast({
          title: '',
          type: 'failed',
          message: 'something went wrong, please try again',
        });
      },
    });
  }

  getMerchantStats() {
    this.merchantService
      .getMerchantStats(this.merchantId as string)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.stat = data.object;
        },
        error: () => {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'something went wrong, please try again',
          });
        },
      });
  }

  setSelectedMenu(
    menu: MenuSimpleModel,
    url: string,
    event?: MouseEvent,
    enableRedirection?: boolean
  ) {
    this.menuService.setSelectedMenu(
      menu,
      `${this.baseMenuUrl}${url}`,
      event,
      enableRedirection
    );
    this.getAccesses(url, enableRedirection);
  }

  private getAccesses(url: string, redirect = true) {
    this.menuService
      .getAccesses(`${this.baseMenuUrl}${url}`, redirect)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        error: () => {
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            message: 'Something went wrong, Please try again',
            title: '',
            type: 'failed',
          });
        },
      });
  }

  getAmount(event: { amount: number | null }) {
    this.amount = event.amount;
    this.billForm.patchValue({
      amount: event.amount,
    });
  }
  refresh() {
    this.merchant = null;
    this.getConnectedMerchantInfo();
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
