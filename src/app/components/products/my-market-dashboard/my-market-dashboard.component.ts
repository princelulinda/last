import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import { MerchantService } from '../../../core/services/merchant/merchant.service';
import { MarketService } from '../../../core/services/market/market.service';
import { VariableService } from '../../../core/services/variable/variable.service';
import { AuthService, ConfigService, ModeModel } from '../../../core/services';
import { DialogService } from '../../../core/services';

import { AllProductsComponent } from '../all-products/all-products.component';
import {
  Account,
  MerchantInfoModel,
  MerchantModel,
  MerchantObjectModel,
  MerchantObjectsModel,
  StatsModel,
} from '../products.model';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import { UserInfoModel } from '../../../core/db/models/auth';
import { LookupComponent } from '../../dev/lookup/lookup.component';
import { ItemModel } from '../../dev/lookup/lookup.model';
import { objectModel } from '../../dashboards/dashboard.model';
import { AmountFieldComponent } from '../../../global/components/custom-field/amount-field/amount-field.component';
// import {
//     OpenMerchantBillPopup,
//     OpenLandscapeBillPopup,
// } from 'src/app/shared/states/bill/bill.actions';

// import {
//     AuthState,
//     BankState,
//     CloseDialog,
//     DialogState,
//     OpenActionDialog,
//     OpenDialog,
//     SwitchThemeState,
// } from 'src/app/shared';
// import { VariableService } from 'src/app/core';

@Component({
  selector: 'app-my-market-dashboard',
  standalone: true,
  imports: [
    SkeletonComponent,
    CommonModule,
    AllProductsComponent,
    LookupComponent,
    AmountFieldComponent,
  ],
  templateUrl: './my-market-dashboard.component.html',
  styleUrl: './my-market-dashboard.component.scss',
})
export class MyMarketDashboardComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  clientInfo: UserInfoModel[] | [] | null = null;
  clientInfo$: Observable<UserInfoModel>;
  amount: string | number | null = 0;
  selectedClient!: ItemModel | null;
  isLoadingInfo = false;
  datas: object[] = [
    {
      element: 'One',
      value: 800,
    },
    {
      element: 'Two',
      value: 700,
    },
    {
      element: 'Three',
      value: 300,
    },
    {
      element: 'Four',
      value: 200,
    },
    {
      element: 'Five',
      value: 100,
    },
    {
      element: 'Six',
      value: 50,
    },
  ];
  merchantId!: string | number;
  merchant!: MerchantModel | null;
  merchantMult!: MerchantModel[];
  merchantInfo!: MerchantModel | null;

  stat!: MerchantModel | null;
  account!: Account;
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
  @ViewChild('closeModal') closeModal = '';
  @ViewChild('closeMerchantsModal') closeMerchantsModal = false;

  successMessage!: string;
  indexMerchant = 0;
  theme!: ModeModel;
  theme$: Observable<ModeModel>;
  constructor(
    // private store: Store,
    private route: ActivatedRoute,
    private merchantService: MerchantService,
    private marketService: MarketService,
    private variableService: VariableService,
    private authService: AuthService,
    private dialogService: DialogService,
    private configService: ConfigService
  ) {
    this.clientInfo$ = this.authService.getUserInfo();
    this.dialog$ = this.dialogService.getDialogState();
    this.theme$ = this.configService.getMode();
  }
  ngOnInit(): void {
    if (this.route.params) {
      this.route.params.subscribe({
        next: data => {
          this.merchantId = data['id'];
          console.log('awdsdgdhgf', data);
        },
      });
    }
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
    });
    this.getConnectedMerchantInfo();
    this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (dialog: DialogResponseModel) => {
        if (dialog) {
          this.dialog = dialog;
          if (this.dialog && this.dialog.response) {
            if (
              this.dialog.response.pin === 'pin submitted' &&
              this.dialog.action === 'confirm pin'
            ) {
              this.generateBill();
            }
          }
        }
      },
    });
    this.getMerchantMultipleInfo();
  }
  enterPin() {
    //   const data = {
    //       title: 'confirm ',
    //       type: 'pin',
    //       message: 'Please enter your pin to continue',
    //       action: 'confirm pin',
    //   };
    //   this.store.dispatch(new OpenActionDialog(data));
    this.dialogService.openDialog({
      title: 'confirm',
      message: 'Please enter your pin to continue',
      type: 'pin',
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
      client: (this.selectedClient as ItemModel).id,
      description: this.billForm.value.description,
      merchant_id: this.merchantId,
      pin_code: this.variableService.pin,
    };

    //   const response = {
    //       title: '',
    //       type: 'loading',
    //       message: '',
    //   };

    //   this.store.dispatch(new OpenDialog(response));
    this.dialogService.openToast({
      title: '',
      type: 'info',
      message: '',
    });

    this.marketService
      .generateBill(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response: objectModel) => {
          // const data = response.object.response_data;
          if (
            response.object['success'] !== undefined &&
            !response.object.success
          ) {
            //   this.store.dispatch(
            //       new CloseDialog({ response: 'close' })
            //   );
            this.dialogService.closeToast();
            this.variableService.pin = '';

            //   const notification = {
            //       title: '',
            //       type: 'failed',
            //       message: response.object.response_message,
            //   };
            //   this.store.dispatch(new OpenDialog(notification));

            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: 'Something went wrong, please try again',
            });
            return;
          }
          // this.successMessage = {
          //     data: {
          //         debit_account: '',
          //         name: this.selectedClient.lookup_title,
          //         merchantName: this.merchant.client.client_full_name,

          //         date: Date.now(),
          //         printable_text: '',
          //         amount: this.amount,
          //         code: data.code,
          //         product: {
          //             name: '',
          //             value: '',
          //         },
          //         description: this.billForm.value.description,
          //         adress: '',
          //         receipt_date: '',
          //         credit_account: this.merchant.merchant_code,
          //     },
          // };
          this.openBillPopup = false;

          this.billForm.reset();
          this.selectedClient = null;
          this.amount = null;
          this.amount = 0;
          // this.store.dispatch(new CloseDialog({ response: 'close' }));
          this.dialogService.closeDialog();
          // this.dialogService.closeToast()
          this.variableService.pin = '';

          // const notification = {
          //     title: '',
          //     type: 'success',
          //     message: response.object.response_message,
          // };

          this.dialogService.openToast({
            title: '',
            type: 'success',
            message: 'success',
          });
          //   this.store.dispatch(new OpenDialog(notification));
          //   this.store.dispatch(
          //       new OpenMerchantBillPopup(this.successMessage.data)
          //   );
          // this.closeModal.nativeElement.click();
          this.billForm.reset();
        },
        error: msg => {
          //   this.store.dispatch(new CloseDialog({ response: 'close' }));
          this.dialogService.closeDialog();

          this.variableService.pin = '';

          // const notification = {
          //     title: '',
          //     type: 'failed',
          //     message:
          //         msg?.object?.response_message ??
          //         'Something went wrong, please try again',
          // };
          //   this.store.dispatch(new OpenDialog(notification));
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
  selectClient(event: ItemModel | null) {
    console.log(event);
    // event ? (this.selectedClient = event) : (this.selectedClient = null);
  }

  getConnectedMerchantInfo() {
    this.isLoadingInfo = true;

    this.merchantService
      .getConnectedMerchantInfo()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: MerchantObjectModel) => {
          this.isLoadingInfo = false;

          this.merchant = data.object.response_data;
          this.account = {
            acc_holder: (this.merchant as MerchantModel).merchant_title,
            acc_number: (this.merchant as MerchantModel).merchant_main_account,
          };
          this.merchantAccountId = (
            this.merchant as MerchantModel
          ).merchant_main_account;
          this.merchantId = (this.merchant as MerchantModel).id;

          this.getMerchantInfos();
          this.getMerchantStats();
        },
        error: msg => {
          console.log('error', msg);
          this.isLoadingInfo = false;

          // const notification = {
          //     title: '',
          //     type: 'failed',
          //     message: 'something went wrong, please try again',
          // };
          // this.store.dispatch(new OpenDialog(notification));

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
        next: (data: MerchantObjectModel) => {
          this.merchantInfo = data.object.response_data;
          this.merchantId = (this.merchantInfo as MerchantModel).id;

          this.getMerchantStats();
        },
        error: msg => {
          console.log('error', msg);

          // const notification = {
          //     title: '',
          //     type: 'failed',
          //     message: 'something went wrong, please try again',
          // };
          // this.store.dispatch(new OpenDialog(notification));
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
        next: (data: MerchantObjectsModel) => {
          this.merchantMult = data.object.response_data;
        },
        error: msg => {
          console.log('error', msg);

          // const notification = {
          //     title: '',
          //     type: 'failed',
          //     message: 'something went wrong, please try again',
          // };
          // this.store.dispatch(new OpenDialog(notification));

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
    // this.closeMerchantsModal.nativeElement.click();

    this.merchantService.getMerchantInfos(merchantId as string).subscribe({
      next: (data: MerchantInfoModel) => {
        this.isMerchantPopupOpened = false;
        this.isLoadingInfo = false;
        this.merchant = data.object.response_data;
        this.getMerchantInfos();
      },
      error: msg => {
        console.log('error', msg);

        // const notification = {
        //     title: '',
        //     type: 'failed',
        //     message: 'something went wrong, please try again',
        // };
        // this.store.dispatch(new OpenDialog(notification));

        this.dialogService.openToast({
          title: '',
          type: 'failed',
          message: 'something went wrong, please try again',
        });
      },
    });
  }

  getMerchantStats() {
    this.marketService
      .getMerchantStats(this.merchantId as string)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: StatsModel) => {
          this.stat = data.object.response_data;
        },
        error: msg => {
          console.log(msg);
          // const notification = {
          //     title: '',
          //     type: 'failed',
          //     message: 'something went wrong, please try again',
          // };
          //   this.store.dispatch(new OpenDialog(notification));

          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'something went wrong, please try again',
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
