import { Component, OnInit, OnDestroy } from '@angular/core';
import { BankModel } from '../../../../core/db/models/bank/bank.model';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import {
  BankService,
  ConfigService,
  DialogService,
} from '../../../../core/services';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AgentModel } from '../agent.models';
import { AgentService } from '../../../../core/services/agent/agent.service';
import { RouterLink } from '@angular/router';
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

@Component({
  selector: 'app-agent-deposit',
  standalone: true,
  imports: [
    SkeletonComponent,
    RouterLink,
    LookupComponent,
    AmountFieldComponent,
    ReactiveFormsModule,
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
    // this.dialog$.pipe(takeUntil(this.OnDestroy$)).subscribe({
    //   next: (dialog: DialogResponseModel) => {
    //     if (dialog) {
    //       this.dialog = dialog;
    //       if (this.dialog && this.dialog.response) {
    //         if (
    //           this.dialog.action === 'confirm pin' &&
    //           this.dialog.response.pin
    //         ) {
    //         }
    //       }
    //     }
    //   },
    // });
    this.getBanks();
    this.getDatAgent();
  }

  getBanks() {
    this.isLoading = true;
    this.bankService
      .getBanksList()
      .pipe(takeUntil(this.OnDestroy$))
      .subscribe({
        next: banks => {
          this.agentMIF = banks;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
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
          this.isLoading = false;
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

  ngOnDestroy() {
    this.OnDestroy$.next();
    this.OnDestroy$.complete();
  }
}
