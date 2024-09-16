import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { DebitAccountComponent } from '../../transfer/debit-account/debit-account.component';
import { AccountsListModel } from '../../account/models';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AmountFieldComponent } from '../../../global/components/custom-field/amount-field/amount-field.component';
import { DialogService } from '../../../core/services';
import { CreatWalletResponse, WalletTopUpBodyModel } from '../wallet.models';
import { ClientService } from '../../../core/services';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import { ActivatedRoute } from '@angular/router';
import { VariableService } from '../../../core/services/variable/variable.service';
@Component({
  selector: 'app-wallet-topup',
  standalone: true,
  imports: [DebitAccountComponent, ReactiveFormsModule, AmountFieldComponent],
  templateUrl: './wallet-topup.component.html',
  styleUrl: './wallet-topup.component.scss',
})
export class WalletTopupComponent implements OnInit {
  selectedDebitAccountForm!: AccountsListModel;
  topupForm!: FormGroup;
  amount: number | null = null;
  private onDestroy$ = new Subject<void>();
  dialogState$!: Observable<DialogResponseModel>;
  pin: string | undefined;
  walletId!: string;
  @Output() topupSuccess = new EventEmitter<void>();
  constructor(
    private dialogService: DialogService,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private variableService: VariableService
  ) {
    this.dialogState$ = this.dialogService.getDialogState();

    this.topupForm = new FormGroup({
      amount: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      description: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: data => {
        this.walletId = data['walletId'];
      },
    });

    this.dialogState$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (dialogResponse: DialogResponseModel) => {
        if (dialogResponse.action === 'pin' && dialogResponse.response.pin) {
          this.pin = dialogResponse.response.pin;
          this.walletPopUp();
        }
      },
    });
  }

  getAmount(event: { amount: number | null }) {
    this.amount = event.amount;
    this.topupForm.patchValue({
      amount: event.amount,
    });
  }
  handleSelectedCreditAccount(event: AccountsListModel) {
    this.selectedDebitAccountForm = event;
  }
  walletPopUp() {
    this.dialogService.dispatchLoading();
    // this.loading = true;
    if (this.selectedDebitAccountForm) {
      const body: WalletTopUpBodyModel = {
        wallet_id: this.walletId,
        debit_bank: this.selectedDebitAccountForm.acc_bank_id,
        debit_account: this.selectedDebitAccountForm.acc_number,
        amount: this.topupForm.get('amount')?.value,
        pin_code: this.pin,
        description: this.topupForm.get('description')?.value,
      };

      this.clientService
        .walletPopUp(body)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: (response: CreatWalletResponse) => {
            // this.loading = false;
            this.dialogService.closeLoading();
            if (response.object.success) {
              this.dialogService.openToast({
                type: 'success',
                title: 'Succès',
                message: response.object.response_message,
              });
              this.topupSuccess.emit();
              this.variableService.announceTopUpComplete();
            } else {
              this.dialogService.openToast({
                type: 'failed',
                title: 'Échec',
                message: response.object.response_message,
              });
            }
          },
          error: () => {
            this.dialogService.closeLoading();
            this.dialogService.openToast({
              type: 'failed',
              title: 'Échec',
              message: 'failed',
            });
          },
        });
    }
  }

  openPinPopup() {
    if (this.selectedDebitAccountForm) {
      this.dialogService.openDialog({
        type: 'pin',
        title: 'Enter your PIN code',
        //message: 'Please enter your PIN code to continue.',
        action: 'pin',
        message: `Wallet <b> ${
          this.walletId
        } </b>  is about being toped up  from  <b>${
          this.selectedDebitAccountForm.acc_number
        }</b> BIF <b>${this.topupForm.get('amount')?.value}</b>   `,
      });
    }
  }
}
