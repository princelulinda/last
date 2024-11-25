import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BankService, DialogService } from '../../../../core/services';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { InstitutionInfoModel } from '../../../transfer/transfer.model';
import { TransferService } from '../../../../core/services/transfer/transfer.service';
import { LookupModel } from '../../../../global/models/global.models';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';
import { AgentService } from '../../../../core/services/agent/agent.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';

@Component({
  selector: 'app-agent-transfer',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonComponent,
    LookupComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './agent-transfer.component.html',
  styleUrl: './agent-transfer.component.scss',
})
export class AgentTransferComponent implements OnInit {
  private OnDestroy$: Subject<void> = new Subject<void>();

  transferForm = this.formBuilder.group({
    amount: [Validators.required],
    description: ['', Validators.required],
    account_number: ['', Validators.pattern('^[0-9]+$')],
    holder_name: [''],
  });
  selectedState: 'bank' | 'debit' | 'agent code' | 'amount' = 'bank';
  banks!: InstitutionInfoModel[];
  selectedInstitution!: InstitutionInfoModel;
  institutionsList: InstitutionInfoModel[] | null = null;
  dialog$: Observable<DialogResponseModel>;
  dialog!: DialogResponseModel;
  agent: LookupModel | null = null;
  agentCode!: string;
  selectedInstitutionType = '';
  isLoading = false;

  constructor(
    private bankService: BankService,
    private transferService: TransferService,
    private agentService: AgentService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService
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
    this.getAgentBanks();
  }

  getAgentBanks() {
    this.bankService
      .getAgentBanks()
      .pipe(takeUntil(this.OnDestroy$))
      .subscribe({
        next: (data: { objects: InstitutionInfoModel[] }) => {
          this.banks = data.objects;
        },
      });
  }
  selectInstitutionType(institutionType: InstitutionInfoModel | string) {
    this.institutionsList = null;
    this.transferForm.reset();
    this.selectedInstitutionType = institutionType as string;
    if (institutionType !== this.selectedInstitutionType) {
      this.selectedInstitutionType = '';
    }
    this.transferService
      .getInstitutionsList(institutionType as InstitutionInfoModel)
      .pipe(takeUntil(this.OnDestroy$))
      .subscribe(list => {
        this.institutionsList = list.objects;
        console.log('the value of institutionsList', this.institutionsList);
      });
  }
  selectAccount(account: InstitutionInfoModel, type: string) {
    this.transferForm.reset();
    if (type === 'agent') {
      this.selectedInstitution = account;
      this.selectedState = 'agent code';
      this.transferForm.value.account_number = this.agentCode;
      this.transferForm.value.holder_name = this.agent?.lookup_title;
    } else {
      this.selectedInstitution = account;
      this.selectedState = 'debit';
    }
  }

  getAgentCode(event: LookupModel | null) {
    this.agent = event;
    if (this.agent) {
      this.agentCode = this.agent?.lookup_subtitle;
      this.selectedState = 'amount';
      console.log('the agentcode value:', this.agent);
    }
  }
  AgentDeposit() {
    const body = {
      deposit_type: '',
      credit_type: '',
      credit_account: this.agentCode,
      credit_bank: this.selectedInstitution.id,
      credit_account_holder: this.agent?.lookup_title,
      amount: this.transferForm.value.amount,
      description: this.transferForm.value.description,
      pin_code: this.dialog.response.pin,
    };
    if (this.selectedInstitutionType === 'agent') {
      body.deposit_type = 'agent_transfert';
      body.credit_type = 'agent';
    } else {
      body.deposit_type = 'bank_transfert';
      body.credit_type = 'account';
      body.credit_account = this.transferForm.value.account_number!;
      body.credit_account_holder = this.transferForm.value.holder_name!;
    }

    this.dialogService.dispatchLoading();
    this.agentService
      .AgentDeposit(body)
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
                response.object.response_message ?? 'successfully deposit',
            });
            this.transferForm.reset();
          } else {
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: response.object.response_message ?? 'failed to deposit',
            });
          }
        },
        error: err => {
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message:
              err.error.object.response_data.pin_code[0] ??
              err.error.message ??
              'Something went wrong, please try agai',
          });
        },
      });
  }
  enterPin() {
    this.dialogService.openDialog({
      type: 'pin',
      title: '',
      message: 'Please enter your pin to continue',
      action: 'confirm pin',
    });
  }
  validateInput(event: KeyboardEvent) {
    const allowedKeys = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'Backspace',
      '-',
      'ArrowLeft',
      'ArrowRight',
      'End',
      'Home',
    ];
    if (!allowedKeys.includes(event.key) && !event.key.match(/^[0-9]$/)) {
      event.preventDefault();
    }
  }
}
