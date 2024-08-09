import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { MarketService } from '../../../../core/services/market/market.service';
import { VariableService } from '../../../../core/services/variable/variable.service';
import { SimpleMerchantService } from '../../../../core/services/simple-merchant/simple-merchant.service';
import { DialogService, ConfigService } from '../../../../core/services';

import { MerchantBillComponent } from '../../../../global/components/popups/bills-format/merchant-bill/merchant-bill.component';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';

import {
  AccountModel,
  BillsModel,
  ErrorModel,
  OptionModel,
  paymentBillsModel,
  WalletModel,
} from '../../products/products.model';
import { ModeModel } from '../../../../core/services/config/main-config.models';
import {
  DialogResponseModel,
  toastTypeModel,
} from '../../../../core/services/dialog/dialogs-models';
// import {
//     OpenDialog,
//     SwitchThemeState,
//     OpenActionDialog,
//     DialogState,
//     CloseDialog,
// } from 'src/app/shared';

@Component({
  selector: 'app-bill-details',
  standalone: true,
  imports: [
    CommonModule,
    MerchantBillComponent,
    SkeletonComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './bill-details.component.html',
  styleUrl: './bill-details.component.scss',
})
export class BillDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  private variableService = inject(VariableService);

  theme$: Observable<ModeModel>;
  theme!: ModeModel;

  billId!: string;
  isLoading = true;
  paymentLoading = false;
  billDetails!: BillsModel;

  billData!: {
    name: string;
    debit_account: string;
    date: string;
    printable_text: string;
    merchantName: string;
    amount: number | string;
    code: string;
    product: {
      name: string;
      value: string;
    };
    description: string;
    adress: string;
    credit_account: string;
  };
  selectedAccount!: AccountModel | null;
  selectedWallet!: WalletModel | null;

  description = new FormControl('', Validators.required);
  dialog$: Observable<DialogResponseModel>;

  constructor(
    // private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private marketService: MarketService,
    private dialogService: DialogService,
    private configService: ConfigService,
    private simpleMerchant: SimpleMerchantService
  ) {
    // this.theme$ = this.store.select(SwitchThemeState.GetTheme);
    this.theme$ = this.configService.getMode();
    // this.dialog$ = this.store.select(DialogState.GetDialog);
    this.dialog$ = this.dialogService.getDialogState();
  }
  ngOnInit() {
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
    });
    if (this.route.params) {
      this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
        next: parms => {
          this.billId = parms['id'];
          this.getBillDetails();
        },
      });
    }

    this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (dialog: DialogResponseModel) => {
        if (dialog) {
          if (dialog && dialog.response) {
            if (
              dialog.response.pin === 'pin submitted' &&
              dialog.action === 'confirm merchant payment'
            ) {
              this.submitPaymentRequest();
            }
          }
        }
      },
    });
  }

  getBillDetails() {
    this.marketService
      .getBillDetails(this.billId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response: paymentBillsModel) => {
          this.billDetails = response.object;
          this.isLoading = false;
          this.description.setValue(this.billDetails.description);
          this.billData = {
            name: this.billDetails.client.client_full_name,
            debit_account: this.billDetails.payment_account.acc_short_number,
            product: {
              name: this.billDetails.orders[0].product.name,
              value: this.billDetails.orders[0].total_amount,
            },
            description: this.billDetails.description,
            adress: '',
            code: this.billDetails.code,
            amount: this.billDetails.total_amount,
            merchantName:
              this.billDetails.merchant_teller.merchant.merchant_title,
            credit_account:
              this.billDetails.merchant_teller.merchant.merchant_code,
            date: this.billDetails.created_at,
            printable_text:
              this.billDetails.orders[0].api_sent_response?.response_data
                ?.printable_text,
          };
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  submitPaymentRequest() {
    this.paymentLoading = true;
    // this.store.dispatch(
    //     new OpenDialog({ title: '', message: '', type: 'loading' })
    // );
    this.dialogService.openToast({
      title: '',
      type: 'info',
      message: '',
    });
    const data = {
      payment_id: this.billId,
      pin_code: this.variableService.pin,
      merchant_id: this.billDetails.merchant_teller.merchant.id,
      amount: parseFloat(this.billDetails.total_amount as string).toFixed(2),
      debit_account: this.selectedAccount
        ? this.selectedAccount.acc_short_number
        : (this.selectedWallet as WalletModel).code,
      debit_bank: this.selectedAccount
        ? this.selectedAccount.acc_bank_id
        : (this.selectedWallet as WalletModel).bank_id,
      debit_type: this.selectedAccount ? 'account' : 'wallet',
      description: this.description.value,
    };
    this.simpleMerchant
      .postData(data)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response: toastTypeModel) => {
          // this.store.dispatch(new CloseDialog({ response: 'close' }));
          this.dialogService.closeDialog();
          this.paymentLoading = false;
          if (response === 'success') {
            this.dialogService.openToast({
              title: '',
              message: 'success',
              type: 'failed',
            });
            // this.store.dispatch(
            //     new OpenDialog({
            //         title: '',
            //         message: response.object.response_message,
            //         type: 'failed',
            //     })
            // );
            return;
          }
          this.router.navigate(['/m/market/bills']);
          this.getBillDetails();
          this.dialogService.openToast({
            title: '',
            message: 'The bill has been successfully paid',
            type: 'success',
          });
          // this.store.dispatch(
          //     new OpenDialog({
          //         title: '',
          //         message:
          //             response.object?.response_message ??
          //             'The bill has been successfully paid',
          //         type: 'success',
          //     })
          // );
          this.selectedAccount = null;
          this.selectedWallet = null;
        },
        error: (err: ErrorModel) => {
          // this.store.dispatch(new CloseDialog({ response: 'close' }));
          this.dialogService.closeDialog();
          this.dialogService.openToast({
            title: '',
            message:
              err?.object?.response_message ??
              'Something went wrong, please retry again',
            type: 'failed',
          });
          // this.store.dispatch(
          //     new OpenDialog({
          //         title: '',
          //         message:
          //             err?.object?.response_message ??
          //             'Something went wrong, please retry again',
          //         type: 'failed',
          //     })
          // );
          this.paymentLoading = false;
        },
      });
  }

  selectedDebitOption(option: OptionModel) {
    this.description.reset();
    if (option.selectedDebitOption === 'account') {
      console.log('ooooook', option);
      this.selectedAccount = option.account ?? null;
      console.log('ooooook selectedAccount', this.selectedAccount);
      this.selectedWallet = null;
    } else if (option.selectedDebitOption === 'wallet') {
      console.log('ooooook', option);
      this.selectedWallet = option.wallet ?? null;
      console.log('ooooook selectedWallet', this.selectedWallet);
      this.selectedAccount = null;
    }
  }

  enterPin() {
    const amount = Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'BIF',
    }).format(this.billDetails.total_amount as number);
    // const data = {
    //     title: 'Payment of a bill',
    //     type: 'pin',
    //     message: ` Enter your pin to confirm the payment of a bill of <b>${amount}</b> from the merchant <b>${this.billDetails.merchant_teller.merchant.merchant_title}</b> `,
    //     action: 'confirm merchant payment',
    // };

    // this.store.dispatch(new OpenActionDialog(data));
    this.dialogService.openDialog({
      title: 'Payment of a bill',
      type: 'pin',
      message: ` Enter your pin to confirm the payment of a bill of <b>${amount}</b> from the merchant <b>${this.billDetails.merchant_teller.merchant.merchant_title}</b> `,
      action: 'confirm merchant payment',
    });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
