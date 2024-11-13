import { Component, OnInit, OnDestroy } from '@angular/core';
import { BankModel } from '../../../../core/db/models/bank/bank.model';
import {
  BankService,
  ConfigService,
  DialogService,
} from '../../../../core/services';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AgentModel } from '../agent.models';
import { AgentService } from '../../../../core/services/agent/agent.service';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';
import { AmountFieldComponent } from '../../../../global/components/custom-field/amount-field/amount-field.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';
import { LookupModel } from '../../../../global/models/global.models';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';

@Component({
  selector: 'app-agent-deposit',
  standalone: true,
  imports: [
    LookupComponent,
    AmountFieldComponent,
    ReactiveFormsModule,
    AmountVisibilityComponent,
  ],
  templateUrl: './agent-deposit.component.html',
  styleUrl: './agent-deposit.component.scss',
})
export class AgentDepositComponent implements OnInit, OnDestroy {
  private OnDestroy$: Subject<void> = new Subject<void>();
  agentMIF: BankModel[] = [];
  isLoading = false;
  agentInfo!: AgentModel;
  selectedMIF!: BankModel;
  selectedBank$!: Observable<BankModel>;
  depositForm = new FormGroup({
    description: new FormControl(''),
    amount: new FormControl(0, Validators.required),
  });
  amount!: number | null;
  dialog!: DialogResponseModel;
  dialog$: Observable<DialogResponseModel>;
  selectedAgent!: LookupModel | null;

  constructor(
    private configService: ConfigService,
    private bankService: BankService,
    private dialogService: DialogService,
    private agentService: AgentService
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
              this.AgentDeposit();
            }
          }
        }
      },
    });
    this.getBanks();
    this.getDatAgent();
  }

  getBanks() {
    this.isLoading = true;
    this.bankService
      .getAgentBanksList()
      .pipe(takeUntil(this.OnDestroy$))
      .subscribe({
        next: banks => {
          this.agentMIF = banks.objects;
          this.isLoading = false;
        },
        error: () => {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'failed to get list of the MIF',
          });
        },
      });
  }

  getDatAgent(): void {
    this.isLoading = true;
    this.agentService
      .getAgentInfos()
      .pipe(takeUntil(this.OnDestroy$))
      .subscribe({
        next: response => {
          this.agentInfo = response.object.response_data;
          this.isLoading = false;
        },
        error: () => {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'failed to get agent informations',
          });
        },
      });
  }

  selectBank(bank: BankModel) {
    this.selectedMIF = bank;
    if (this.selectedMIF) {
      this.configService.setSelectedBank(bank);
    }
  }

  getAmount(event: { amount: number | null }) {
    this.amount = event.amount;
    this.depositForm.patchValue({
      amount: event.amount,
    });
  }

  selectAgent(event: LookupModel | null) {
    if (event) {
      this.selectedAgent = event;
    } else {
      this.selectedAgent = null;
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

  AgentDeposit() {
    const data = {
      deposit_type: 'from_agent',
      credit_type: 'account',
      credit_account: (this.selectedAgent as LookupModel).lookup_subtitle,
      credit_bank: this.selectedMIF.id,
      credit_account_holder: (this.selectedAgent as LookupModel).lookup_title,
      amount: this.depositForm.value.amount,
      description: this.depositForm.value.description,
      pin_code: this.dialog.response.pin,
    };

    this.dialogService.dispatchLoading();
    this.agentService
      .AgentDeposit(data)
      .pipe(takeUntil(this.OnDestroy$))
      .subscribe({
        next: response => {
          this.dialogService.closeLoading();
          this.isLoading = false;
          if (response.object.success === true) {
            this.dialogService.openToast({
              title: '',
              type: 'success',
              message:
                response.object.response_message ?? 'successful to deposit',
            });
            this.depositForm.reset();
          } else {
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: response.object.response_message ?? 'failed to deposit',
            });
            this.depositForm.reset();
          }
        },
        error: () => {
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'Something went wrong, please try again',
          });
          this.depositForm.reset();
        },
      });
  }

  ngOnDestroy() {
    this.OnDestroy$.next();
    this.OnDestroy$.complete();
  }
}
