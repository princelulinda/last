import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Observable, Subject, takeUntil } from 'rxjs';

import {
  DialogService,
  ConfigService,
  MerchantService,
} from '../../../../core/services';

import { MerchantBillComponent } from '../../../../global/components/popups/bills-format/merchant-bill/merchant-bill.component';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';

import { ModeModel } from '../../../../core/services/config/main-config.models';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';
import { DebitAccountComponent } from '../../../transfer/debit-account/debit-account.component';
import { accountsList } from '../../../account/models';
import { WalletList } from '../../../wallet/wallet.models';
import { DebitOptionsModel } from '../../../transfer/transfer.model';
import { BankModel } from '../../../../core/db/models/bank/bank.model';
import { BillsModel } from '../bills.model';
import { MerchantSimplePaymentBodyModel } from '../../merchant.models';

@Component({
  selector: 'app-bill-details',
  standalone: true,
  imports: [
    CommonModule,
    MerchantBillComponent,
    SkeletonComponent,
    ReactiveFormsModule,
    RouterLink,
    DebitAccountComponent,
  ],
  templateUrl: './bill-details.component.html',
  styleUrl: './bill-details.component.scss',
})
export class BillDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  theme$: Observable<ModeModel>;
  theme!: ModeModel;

  billId!: string;
  isLoading = true;
  paymentLoading = false;
  billDetails!: BillsModel;
  pin!: string;
  dialog!: DialogResponseModel;

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
  selectedAccount!: string;
  selectedWallet!: string;
  debitBank!: number;
  bank$: Observable<BankModel>;

  descriptionForm = new FormGroup({
    description: new FormControl('', Validators.required),
  });
  dialog$: Observable<DialogResponseModel>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private merchantService: MerchantService,
    private dialogService: DialogService,
    private configService: ConfigService
  ) {
    this.theme$ = this.configService.getMode();
    this.dialog$ = this.dialogService.getDialogState();
    this.bank$ = this.configService.getSelectedBank();
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
              dialog.response.pin &&
              dialog.action === 'confirm merchant payment'
            ) {
              this.pin = dialog.response.pin;
              this.submitPaymentRequest();
            }
          }
        }
      },
    });
    this.bank$.subscribe((bank: BankModel) => {
      if (bank) {
        this.debitBank = bank.id;
      }
    });
  }

  getBillDetails() {
    this.merchantService
      .getBillDetails(this.billId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.billDetails = response.object;
          this.isLoading = false;
          this.descriptionForm.patchValue({
            description: this.billDetails.description,
          });
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
    const data: MerchantSimplePaymentBodyModel = {
      payment_id: Number(this.billId),
      pin_code: this.pin,
      merchant_id: this.billDetails.merchant_teller.merchant.id,
      amount: parseFloat(this.billDetails.total_amount as string).toFixed(2),
      debit_account: this.selectedAccount
        ? this.selectedAccount
        : this.selectedWallet,
      debit_type: this.selectedAccount ? 'account' : 'wallet',
      description: this.descriptionForm.value.description as string,
      debit_bank: this.debitBank,
    };

    this.dialogService.dispatchLoading();
    this.merchantService
      .doMerchantSimplePayment(data)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.dialogService.closeLoading();
          this.paymentLoading = false;
          if (
            response.object['success'] !== undefined &&
            !response.object.success
          ) {
            this.pin = '';
            this.dialogService.openToast({
              title: '',
              message: response.object.response_message,
              type: 'failed',
            });
            this.selectedAccount = '';
            this.selectedWallet = '';
            this.descriptionForm.reset();
            // return;
          }
          if (response.object.success) {
            this.router.navigate(['/m/market/bills']);
            this.getBillDetails();
            this.dialogService.openToast({
              title: '',
              message:
                response.object?.response_message ??
                'The bill has been successfully paid',
              type: 'success',
            });
            this.selectedAccount = '';
            this.selectedWallet = '';
            this.descriptionForm.reset();
          }
        },
        error: err => {
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            title: '',
            message:
              err?.object?.response_message ??
              'Something went wrong, please retry again',
            type: 'failed',
          });
          this.paymentLoading = false;
          this.selectedAccount = '';
          this.selectedWallet = '';
          this.descriptionForm.reset();
        },
      });
  }
  onAccountSelected(account: accountsList) {
    this.descriptionForm.reset();
    if (account.acc_short_number) {
      this.selectedAccount = account.acc_short_number;
    }
  }

  onWalletSelected(account: WalletList) {
    this.descriptionForm.reset();
    if (account.account) {
      this.selectedWallet = account.code;
    }
  }
  selectedDebitOption(option: DebitOptionsModel) {
    this.descriptionForm.reset();
    if (option.selectedDebitOption === 'account') {
      this.selectedAccount = option.account;
      this.selectedWallet = '';
    } else if (option.selectedDebitOption === 'wallet') {
      this.selectedWallet = option.wallet ?? null;
      this.selectedAccount = '';
    }
  }

  enterPin() {
    const amount = Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'BIF',
    }).format(this.billDetails.total_amount as number);
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
