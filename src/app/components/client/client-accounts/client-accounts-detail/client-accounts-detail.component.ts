import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../../core/services';

import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, Observable } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  AccountCalculatedBalanceModel,
  AccountStatusModel,
  AccountTypeModel,
  ClientDetailModel,
} from '../../client.model';
import { CommonModule } from '@angular/common';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { OrganizationModel } from '../../../auth/auth.model';
import { ConfigService } from '../../../../core/services';
import { ClipboardDirective } from '../../../../global/directives/clipboard/clipboard.directive';
import { StatementComponent } from '../../../statements/statement/statement.component';
import { AccountDetailModel } from '../../../account/models';
import { DialogService } from '../../../../core/services';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';
import { ItemModel } from '../../../../global/components/lookups/lookup/lookup.model';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';
import { AmountFieldComponent } from '../../../../global/components/custom-field/amount-field/amount-field.component';
@Component({
  selector: 'app-client-accounts-detail',
  standalone: true,
  imports: [
    CommonModule,
    AmountVisibilityComponent,
    ClipboardDirective,
    StatementComponent,
    ReactiveFormsModule,
    FormsModule,
    LookupComponent,
    AmountFieldComponent,
  ],
  templateUrl: './client-accounts-detail.component.html',
  styleUrl: './client-accounts-detail.component.scss',
})
export class ClientAccountsDetailComponent implements OnInit {
  isLoading = false;
  LoadingStatus = false;
  account: AccountDetailModel | null = null;
  clientDetailsData!: ClientDetailModel;
  accountId!: string;
  selectedSetting = 'details';
  operationActionForm!: FormGroup;
  accountCalculatedBalance: AccountCalculatedBalanceModel | null = null;
  organization$: Observable<OrganizationModel | null>;

  accountStatus: AccountStatusModel[] | null = null;
  organization!: OrganizationModel;
  selectedManageId: number | null = null;
  organizationId!: number;
  selectedConfig = false;
  isUpdateAccountDetails = false;
  alterStatus = false;
  isChangingStatus = false;
  clientMainId!: string;
  accountType: AccountTypeModel[] | null = null;
  statusType = [
    { name: 'Opened', abbrev: 'O' },
    { name: 'Blocked', abbrev: 'B' },
    { name: 'Closed', abbrev: 'C' },
  ];

  statusReason = [
    { name: 'Opened Account', abbrev: 'O' },
    { name: 'Blocked Account', abbrev: 'B' },
    { name: 'Closed Account', abbrev: 'C' },
  ];

  statusss = new FormGroup({
    statusReason: new FormControl(this.statusReason[0]),
    statusType: new FormControl(this.statusType[0]),
    statusReasonExplained: new FormControl(''),
  });
  private onDestroy$ = new Subject<void>();
  dialogState$!: Observable<DialogResponseModel>;
  isChangingAccountType = false;
  accountTypeAt!: number;
  selectedAccountType!: string;
  amountField: string | number | null = 0;
  pin!: string;
  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private dialogService: DialogService
  ) {
    this.organization$ = this.configService.getSelectedOrganization();
    this.dialogState$ = this.dialogService.getDialogState();
  }
  ngOnInit(): void {
    this.organization$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: organization => {
        if (organization) {
          this.organization = organization;
          this.organizationId = organization.id;
        }
      },
    });
    this.dialogState$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (dialogResponse: DialogResponseModel) => {
        if (dialogResponse.action === 'pin' && dialogResponse.response.pin) {
          this.pin = dialogResponse.response.pin;
          this.changeAccountType();
        }
      },
    });

    this.route.params.subscribe({
      next: data => {
        this.accountId = data['accountId'];
        //this.getClientAccountDetails();
        // this.getAccountMiniStatement();
        //this.getAccountCalculatedBalance();
      },
    });
    // this.accountId ="2"
    this.getClientAccountDetails();
    this.getAccountCalculatedBalance();
  }

  getAmount(event: { amount: number | null }) {
    this.amountField = event.amount;
  }
  getClientAccountDetails() {
    this.isLoading = true;
    this.account = null;
    this.selectedSetting = 'details';

    this.clientService
      .getClientAccountDetails(this.accountId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response: { object: AccountDetailModel }) => {
          this.isLoading = false;

          this.account = response.object;
          if (this.account) {
            this.operationActionForm = new FormGroup({
              acc_debitor_rate: new FormControl(this.account.acc_debitor_rate),
              acc_creditor_rate: new FormControl(
                this.account.acc_creditor_rate
              ),
              acc_reserved_balance: new FormControl(
                this.account.acc_reserved_balance
              ),
            });

            // console.log('hellooo', this.account);
          }
          this.getClientAccountStatus();
          this.clientMainId = this.account.acc_client_id;
          this.getClientInfo();
        },
        error: error => {
          this.isLoading = false;
          console.log(error);
        },
      });
  }

  getAccountTypeList() {
    this.clientService
      .getAccountTypeList(
        this.clientDetailsData.client_category_id,
        this.clientDetailsData.client_category_type_id,

        this.account?.acc_branch_object.id as string | null
      )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.accountType = response.objects;
          this.isLoading = false;
        },
        error: err => {
          console.error('Erreur :', err);
          this.isLoading = false;
        },
      });
  }

  enterPin() {
    this.dialogService.openDialog({
      type: 'pin',
      title: 'Enter your PIN code',
      message: 'Please enter your PIN code to continue.',
      action: 'pin',
    });
  }

  updateClientAccountDetails() {
    if (this.amountField) {
      this.operationActionForm.patchValue({
        acc_reserved_balance: this.amountField,
      });
    }

    this.isUpdateAccountDetails = true;
    this.dialogService.dispatchLoading();

    const selectedAccount = this.accountId;
    const acc_debitor_rate = this.operationActionForm.value.acc_debitor_rate;
    const acc_creditor_rate = this.operationActionForm.value.acc_creditor_rate;
    const acc_reserved_balance_upd =
      this.operationActionForm.value.acc_reserved_balance;

    if (
      selectedAccount &&
      acc_debitor_rate &&
      acc_creditor_rate &&
      acc_reserved_balance_upd
    ) {
      this.clientService
        .updateClientAccountDetails(
          selectedAccount,
          acc_debitor_rate,
          acc_creditor_rate,
          acc_reserved_balance_upd
        )
        .subscribe({
          next: response => {
            this.isUpdateAccountDetails = false;
            this.dialogService.closeLoading();

            this.dialogService.openToast({
              type: 'success',
              title: 'Succès',
              message: response.object.response_message ?? 'Success',
            });
            this.getClientAccountDetails();
          },
          error: error => {
            console.error('Creation failed', error);
            this.dialogService.closeLoading();
            this.dialogService.openToast({
              type: 'failed',
              title: 'Échec',
              message: 'Failed, please try again',
            });
            this.isUpdateAccountDetails = false;
          },
        });
    }
  }

  changeAccountType() {
    this.isChangingAccountType = true;
    this.dialogService.dispatchLoading();

    const account = this.account?.id;
    const acc_defaults = this.selectedAccountType;
    const pin = this.pin;

    if (account && acc_defaults && pin) {
      this.clientService
        .changeAccountType(account, acc_defaults, pin)
        .subscribe({
          next: response => {
            this.isChangingAccountType = false;
            this.dialogService.closeLoading();
            if (response.object.success) {
              this.dialogService.openToast({
                type: 'success',
                title: 'Succès',
                message: response.object.response_message ?? 'Success',
              });

              this.isChangingAccountType = false;
            } else {
              this.dialogService.openToast({
                type: 'failed',
                title: 'Échec',
                message: response.object.response_message ?? 'Failed',
              });

              this.isChangingAccountType = false;
            }
          },
          error: error => {
            console.error('Creation failed', error);
            this.dialogService.closeLoading();
            this.dialogService.openToast({
              type: 'failed',
              title: 'Échec',
              message: 'Failed, please try again',
            });
            this.isChangingAccountType = false;
          },
        });
    }
  }

  selectAccountType(accountType: string, atIndex: number) {
    this.accountTypeAt = atIndex;
    this.selectedAccountType = accountType;
  }

  getClientInfo() {
    this.clientService
      .getClientDetails('1192')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response: { object: ClientDetailModel }) => {
          this.isLoading = false;

          this.clientDetailsData = response.object;
          this.getAccountTypeList();
        },
        error: error => {
          this.isLoading = false;
          console.log(error);
        },
      });
  }
  getClientAccountStatus() {
    this.LoadingStatus = true;
    this.clientService
      .getClientAccountStatus(this.accountId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.accountStatus = response.objects;
          this.isLoading = false;
        },
        error: err => {
          console.error('Erreur :', err);
          this.isLoading = false;
        },
      });
  }
  setSelectedManageType($event: ItemModel | null) {
    this.selectedManageId = $event ? $event.id : null;
  }
  getAccountCalculatedBalance() {
    this.isLoading = true;
    this.account = null;
    this.selectedSetting = 'details';

    this.clientService
      .getAccountCalculatedBalance(this.accountId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: account => {
          this.isLoading = false;

          this.accountCalculatedBalance = account.object;
        },
        error: error => {
          this.isLoading = false;
          console.log(error);
        },
      });
  }

  selectSetting(setting: string) {
    this.selectedSetting = setting;
    if (this.selectedSetting) {
      this.selectedConfig = false;
    }
  }
  selectConfig() {
    this.selectedConfig = !this.selectedConfig;
  }

  refresh() {
    this.account = null;

    this.isLoading = true;

    this.getClientAccountDetails();
  }
  changeStatus() {
    this.alterStatus = !this.alterStatus;
  }

  changeAccountStatus() {
    this.isChangingStatus = true;
    this.dialogService.dispatchLoading();

    const account_status = this.statusss.value.statusType?.abbrev;
    const status_reason = this.statusss.value.statusReason?.abbrev;
    const reason_explained = this.statusss.value.statusReasonExplained;
    const clients = this.account?.acc_number;

    if (account_status && status_reason && reason_explained && clients) {
      this.clientService
        .changeAccountStatus(
          account_status,
          status_reason,
          reason_explained,
          clients
        )
        .subscribe({
          next: response => {
            //this.isChangingAccountType = true;
            this.dialogService.closeLoading();
            if (response.object.success) {
              this.isChangingStatus = false;
              this.dialogService.openToast({
                type: 'success',
                title: 'Succès',
                message: response.object.response_message ?? 'Success',
              });
              this.alterStatus = false;
              this.statusss.reset();
            } else {
              this.dialogService.openToast({
                type: 'failed',
                title: 'Échec',
                message: response.object.response_message ?? 'Failed',
              });
              this.isChangingStatus = false;
            }
          },
          error: error => {
            console.error('Creation failed', error);
            this.dialogService.closeLoading();
            this.dialogService.openToast({
              type: 'failed',
              title: 'Échec',
              message: 'Failed, please try again',
            });
            this.isChangingStatus = false;
          },
        });
    }
  }
}
