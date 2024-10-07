import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BankService, ConfigService, DialogService } from '../../core/services';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BankModel } from '../../core/db/models/bank/bank.model';
import { DialogResponseModel } from '../../core/services/dialog/dialogs-models';
import { DebitAccountComponent } from '../transfer/banking/debit-account/debit-account.component';
import { LookupComponent } from '../../global/components/lookups/lookup/lookup.component';
import { AmountFieldComponent } from '../../global/components/custom-field/amount-field/amount-field.component';
import { AccountsListModel } from '../account/models';
import { WalletList } from '../wallet/wallet.models';
import { ItemModel } from '../../global/components/lookups/lookup/lookup.model';
import { ResModel } from '../loan/loan.models';
@Component({
  selector: 'app-withdrawal',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DebitAccountComponent,
    LookupComponent,
    ReactiveFormsModule,
    AmountFieldComponent,
  ],
  templateUrl: './withdrawal.component.html',
  styleUrl: './withdrawal.component.scss',
})
export class WithdrawalComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  backgroundColor = '#f1f1f1';

  dialog$: Observable<DialogResponseModel>;
  // dialog: any;
  withdrawForm: FormGroup;
  menuSelected = 'agent';
  valueCheck = false;
  amountWritten!: number | null;
  bank$: Observable<BankModel>;
  debitBank!: number;
  transferDone = false;
  message!: string;
  pin = '';

  // accessBankId: any;
  // accessClientId: any;
  agentCode!: string;
  debitAccount!: string;
  debitType!: string;
  withdrawalType = 'c2a_normal';

  agent!: ItemModel | null;
  // debit: any = {};
  account!: AccountsListModel | WalletList | null;
  constructor(
    private bankService: BankService,
    private dialogService: DialogService,
    private configService: ConfigService,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.bank$ = this.configService.getSelectedBank();
    this.withdrawForm = this.fb.group({
      description: ['', Validators.required],
    });
    this.dialog$ = this.dialogService.getDialogState();
  }

  ngOnInit(): void {
    this.dialog$.subscribe({
      next: dialog => {
        if (dialog.action === 'confirm withdraw' && dialog.response.pin) {
          this.pin = dialog.response.pin;
          this.withdrawFromAgent();
        }
      },
    });

    this.bank$.subscribe((bank: BankModel) => {
      this.debitBank = bank.id;
    });
  }

  selectMenu(menu: string) {
    this.menuSelected = menu;
    this.amountWritten = null;
    this.withdrawForm.reset();
  }

  getAgentCode(event: ItemModel | null) {
    this.agent = event as ItemModel;
    this.agentCode = this.agent.lookup_subtitle;
  }

  getAccountSelected(event: AccountsListModel | WalletList) {
    this.account = event;
    if ((this.account as AccountsListModel).acc_short_number) {
      this.debitAccount = (this.account as AccountsListModel).acc_short_number;
      this.debitType = 'account';
    } else {
      this.debitAccount = (this.account as WalletList).code;
      this.debitType = 'wallet';
    }
  }
  inputAmount(event: { amount: number | null }) {
    this.amountWritten = event.amount;
  }

  enterPin() {
    this.message = ` Withdraw <b>${this.amountWritten}</b> from agent 
               <b>${this.agent?.lookup_title}</b> code: <b>${this.agentCode}</b>
                with your account 
              <b>${this.debitAccount} </b> `;

    if (this.withdrawForm.value.description) {
      this.dialogService.openDialog({
        title: 'Confirm withdraw',
        type: 'pin',
        message: this.message,
        action: 'confirm withdraw',
      });
    }
  }

  withdrawFromAgent() {
    this.withdrawalType = 'c2a_normal';
    const withdraw = {
      agent_code: this.agentCode,
      amount: this.amountWritten as number,
      debit_account: this.debitAccount,
      debit_bank: this.debitBank,
      debit_type: this.debitType,
      description: this.withdrawForm.value.description,
      pin_code: this.pin,
      withdrawal_type: this.withdrawalType,
    };

    this.dialogService.dispatchLoading();
    this.withdrawForm.disable();
    this.bankService
      .withdrawFromAgent(withdraw)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          const data = response as { object: ResModel };
          this.dialogService.closeLoading();
          console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', data);
          this.withdrawForm.enable();
          if (data.object.success === false) {
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: data.object.response_message,
            });
          } else {
            this.dialogService.openToast({
              title: '',
              type: 'success',
              message: data.object.response_message,
            });
            this.withdrawForm.reset();
            this.agent = null;
            this.account = null;
            this.transferDone = true;
          }
        },
        error: data => {
          this.dialogService.closeLoading();
          this.withdrawForm.enable();
          let message;
          if (data.object) {
            message = data.object.response_message;
          } else {
            message = 'Error occurred';
          }

          this.withdrawForm.enable();
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: message,
          });
        },
      });
  }

  goBack(): void {
    this.location.back();
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
