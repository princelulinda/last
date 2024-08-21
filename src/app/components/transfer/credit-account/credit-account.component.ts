import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  AuthService,
  BankService,
  ConfigService,
  DialogService,
} from '../../../core/services';
import { TransferService } from '../../../core/services/transfer/transfer.service';
import { AmountFieldComponent } from '../../../global/components/custom-field/amount-field/amount-field.component';
import { UserInfoModel } from '../../../core/db/models/auth';
import {
  activeMainConfigModel,
  ModeModel,
} from '../../../core/services/config/main-config.models';
import { bankModel } from '../../../core/db/models/bank/bank.model';
import {
  AmountEventModel,
  CreditAccountModel,
  CreditDetail,
  DebitAccountModel,
  DebitWalletModel,
  InstitutionInfoModel,
  LookupData,
  LookupResponseModel,
  PopupEventModel,
  SelectedCreditAccountEventModel,
  TransferResponseModel,
} from '../transfer.model';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';

@Component({
  selector: 'app-credit-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AmountFieldComponent],
  templateUrl: './credit-account.component.html',
  styleUrl: './credit-account.component.scss',
})
export class CreditAccountComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  isModalShown = false;
  debitAccount: DebitAccountModel | null = null;
  hover = false;
  @Input() selectedDebitAccountType = '';

  @Input() walletBankId: string | number = '';

  selectedCreditAccountType = '';
  selectedInstitutionType = '';
  totalAmount = 0;
  lookupDebitAccountUrl = '/clients/list/all/object_lookup?lookup_data=';

  institutionsListCount = 0;
  institutionsList: InstitutionInfoModel[] | undefined;

  selectedInstitution: InstitutionInfoModel | null = null;

  @Output() isTransferDone = new EventEmitter<boolean>();

  client: DebitAccountModel | null = null;

  accounts: DebitAccountModel[] = [];

  wallets: DebitWalletModel[] = [];
  @Input() isLoading = false;
  debitWallet: DebitWalletModel | null = null;

  defaultBank: bankModel | null | undefined;

  banks: bankModel[] = [];

  @Input() debitNumber = '';

  @Input() debitHolder = '';
  amount: number | null = null;
  amountToSend: number | null = null;
  clientId: number | null = null;
  @Input() transferType:
    | 'merchantTransfer'
    | 'agentTransfer'
    | 'simpleTransfer' = 'simpleTransfer';
  isPopupShown = false;
  isAmountChanging = false;
  isBanksListShown = false;

  values: CreditDetail[] = [];

  transferResponse!: TransferResponseModel;

  creditNumber: string | null | undefined;

  creditName: string | null | undefined;
  pendingTransfers: {
    account_holder: string;
    institution: InstitutionInfoModel;
    account_number: string;
    amount: number | string;
  }[] = [];
  lookup = new FormControl<LookupResponseModel | string>('');
  @Output() selectedCreditAccount =
    new EventEmitter<SelectedCreditAccountEventModel>();

  creditAccount: CreditAccountModel | null | undefined;
  transferForm = new FormGroup({
    accountNumber: new FormControl('', Validators.required),
    accountHolder: new FormControl('', Validators.required),
    debit_description: new FormControl('', Validators.required),
    amount: new FormControl(this.amount, Validators.required),
    merchant_reference: new FormControl(''),
  });
  @Input() transferStep = '';
  dialog$: Observable<DialogResponseModel>;
  pin = '';

  lookupData: LookupData | null = null;

  @Input() isOperation = false;
  @Input() showBack = false;
  @Input() bankId!: bankModel;

  clientInfo!: UserInfoModel;
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;
  private userInfo$: Observable<UserInfoModel>;
  mode!: ModeModel;
  mode$!: Observable<ModeModel>;
  @Output() transferStepChange = new EventEmitter<string>();

  selectedBank!: bankModel;
  selectedBank$!: Observable<bankModel>;
  isBalanceShown = false;
  isBalanceShown$: Observable<boolean>;
  creditAccountAdded = false;
  constructor(
    private transferService: TransferService,
    private bankService: BankService,
    private configService: ConfigService,
    private authService: AuthService,
    private dialogService: DialogService
  ) {
    this.mode$ = this.configService.getMode();
    this.userInfo$ = this.authService.getUserInfo();
    this.mainConfig$ = this.configService.getMainConfig();
    this.selectedBank$ = this.configService.getSelectedBank();
    this.isBalanceShown$ = this.dialogService.getAmountState();
    this.dialog$ = this.dialogService.getDialogState();
  }

  ngOnInit() {
    this.transferStep = 'first step';

    this.transferService.handleTransfer(true);
    this.selectedBank$.subscribe({
      next: datas => {
        this.selectedBank = datas;
      },
    });
    this.userInfo$.subscribe({
      next: userinfo => {
        this.clientInfo = userinfo;
        this.clientId = this.clientInfo.client.id;
        this.bankService
          .getBanksList()
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(banks => {
            this.banks = banks;
            this.defaultBank = banks.find(bank => bank.is_default === true);
          });
      },
    });
    this.isBalanceShown$.subscribe(isBalanceShown => {
      this.isBalanceShown = isBalanceShown;
    });

    this.mode$.subscribe({
      next: datas => {
        this.mode = datas;
      },
    });

    this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (dialogResponse: DialogResponseModel) => {
        if (
          dialogResponse.response.pin &&
          dialogResponse.action === 'confirm transfer'
        ) {
          this.pin = dialogResponse.response.pin;

          this.validateTransfer();
        }
      },
    });

    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });

    this.selectedCreditAccountType = '';
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.transferService.handleTransfer(false);
  }

  getClient(client: DebitAccountModel) {
    this.debitAccount = client;

    if (!this.debitAccount) {
      this.selectedInstitutionType = '';
      this.selectedInstitution = null;
    }
  }

  getAmount(event: AmountEventModel) {
    this.amount = event.amount;
    this.transferForm.patchValue({
      amount: this.amount,
    });
  }

  selectCreditAccountType(accountType: string) {
    this.creditAccount = undefined;
    this.selectedCreditAccountType = accountType;
    if (accountType !== this.selectedCreditAccountType) {
      this.selectedCreditAccountType = '';
    }
    if (accountType === 'account') {
      this.selectedInstitution = null;
      this.selectedInstitutionType = '';
    }
    if (accountType === 'wallet') {
      this.selectedInstitution = null;
      this.selectedInstitutionType = '';
    }
  }

  selectInstitutionType(institutionType: InstitutionInfoModel | string) {
    this.institutionsList = undefined;
    this.selectedInstitutionType = institutionType as string;
    if (institutionType !== this.selectedInstitutionType) {
      this.selectedInstitution = null;
    }
    this.transferService
      .getInstitutionsList(institutionType as InstitutionInfoModel)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(list => {
        this.institutionsList = list.objects;
        this.institutionsListCount = this.institutionsList.length;
      });
  }

  selectInstitution(institution: InstitutionInfoModel) {
    this.selectedInstitution = institution;
    // this.selectedInstitutionInfos.emit(this.selectedInstitution)
    this.lookup.setValue('');
    this.creditAccount = undefined;
    this.transferForm.patchValue({
      accountNumber: '',
      accountHolder: '',
      debit_description: '',
      amount: null,
    });
    this.lookup.setValue('');
  }

  changeInstitutionType() {
    this.selectedInstitutionType = '';
    this.selectedInstitution = null;
    this.creditAccount = undefined;
    this.transferForm.patchValue({
      accountNumber: '',
      accountHolder: '',
      debit_description: '',
      amount: null,
    });
    this.lookup.setValue('');
  }

  changeInstitution() {
    this.selectedInstitution = null;
    this.creditAccount = undefined;
    this.lookup.setValue('');
    this.transferForm.patchValue({
      accountNumber: '',
      accountHolder: '',
      debit_description: '',
      amount: null,
    });
  }

  selectDebitAccount(index: number) {
    this.debitAccount = this.accounts[index];
  }

  selectDebitWallet(index: number) {
    this.debitWallet = this.wallets[index];
  }

  lookupAccount() {
    this.isLoading = true;
    const accountNumber =
      typeof this.lookup.value === 'string' ? this.lookup.value : null;
    const dataAccount: LookupData = {
      account_number: accountNumber,
      bank_slug: this.selectedInstitution?.slug,
      account_type: this.selectedCreditAccountType,
    };

    const dataWallet: LookupData = {
      account_number: accountNumber,
      bank_slug: this.defaultBank?.slug,
      account_type: this.selectedCreditAccountType,
    };

    if (this.selectedCreditAccountType !== 'wallet') {
      this.lookupData = dataAccount;
    } else {
      this.lookupData = dataWallet;
    }
    return this.transferService
      .lookupAccount(this.lookupData)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.isLoading = false;
          if (response && response.object && response.object.success === true) {
            this.creditAccount = response.object.response_data;

            if (this.selectedInstitution) {
              if (this.selectedInstitution.api_values.has_lookup) {
                this.transferForm.patchValue({
                  accountNumber: this.creditAccount?.account_number,
                  accountHolder: this.creditAccount?.name,
                });
              }
            }

            if (this.selectedCreditAccountType === 'wallet') {
              this.transferForm.patchValue({
                accountNumber: this.creditAccount?.account_number,
                accountHolder: this.creditAccount?.name,
              });
            }
            this.lookup.setValue('');
          }

          if (!this.selectedInstitution) {
            this.selectedInstitution = this
              .defaultBank as unknown as InstitutionInfoModel;
          }

          if (response.object.success === false) {
            this.creditAccount = null;
            this.dialogService.openToast({
              type: 'failed',
              title: '',
              message:
                'could not find the account with number ' +
                this.lookup.value +
                ' in ' +
                this.selectedInstitution.name,
            });
          }
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
  removeCreditAccount(accountNumber: string) {
    if (this.transferStep !== 'first step') {
      this.transferStep = 'first step';
      this.transferStepChange.emit('first step');
    }
    this.pendingTransfers = this.pendingTransfers.filter(
      account => account.account_number !== accountNumber
    );

    if (this.pendingTransfers.length === 0) {
      this.creditAccountAdded = false;
    }
    this.creditAccount = null;
    this.transferForm.patchValue({
      debit_description: '',
    });
  }
  addCreditAccount() {
    if (this.pendingTransfers.length >= 1) {
      return;
    }
    if (!this.creditAccountAdded) {
      this.pendingTransfers.push({
        account_holder: this.transferForm.value.accountHolder ?? '',
        institution: this.selectedInstitution!,
        account_number: this.transferForm.value.accountNumber ?? '',
        amount: this.transferForm.value.amount!,
      });
      this.creditAccountAdded = true;
    }
  }

  toggleTransferStep(step: string) {
    this.transferStep = step;
    this.transferStepChange.emit(this.transferStep);
    this.selectedCreditAccount.emit({
      transferForm: this.transferForm.value as {
        accountNumber: string;
        accountHolder: string;
        debit_description: string;
        amount: number;
      },
      selectedInstitution: this.selectedInstitution as InstitutionInfoModel,
      selectedCreditAccountType: this.selectedCreditAccountType as string,
    });
  }
  public validateTransfer() {
    this.amountToSend = this.amount;

    this.isLoading = true;

    if (this.selectedCreditAccountType === 'wallet') {
      this.selectedInstitution = this
        .defaultBank as unknown as InstitutionInfoModel;
    }

    const data = {
      amount: this.amount,
      credit_account: this.transferForm.value.accountNumber,
      credit_account_holder: this.transferForm.value.accountHolder,
      credit_bank: this.selectedInstitution?.id,
      credit_type: this.selectedCreditAccountType,
      debit_account: this.debitNumber,
      debit_bank: this.selectedBank.id ?? this.walletBankId ?? '',
      debit_type: this.selectedDebitAccountType,
      pin_code: this.pin,
      debit_description: this.transferForm.value.debit_description,
      credit_description: this.transferForm.value.debit_description,
    };

    this.dialogService.dispatchLoading();

    if (this.selectedCreditAccountType === 'wallet') {
      this.creditNumber = this.creditAccount?.account_number;
      this.creditName = this.creditAccount?.name;
    } else {
      this.creditNumber = this.transferForm.value.accountNumber;
      this.creditName = this.transferForm.value.accountHolder;
    }

    this.transferService
      .doTransfer(data)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.dialogService.closeLoading();

          this.isLoading = false;
          this.pin = '';

          if (response.object.success === false) {
            this.isAmountChanging = false;

            this.dialogService.openToast({
              type: 'failed',
              title: '',
              message:
                response?.object?.response_message ??
                $localize`Something went wrong please retry again !`,
            });
          } else {
            this.isTransferDone.emit(true);
            this.isAmountChanging = true;

            this.transferResponse = response.object
              .response_data as unknown as TransferResponseModel;
            this.selectedInstitutionType = '';
            this.selectedCreditAccountType = '';
            this.pendingTransfers = [];
            this.isAmountChanging = false;
            this.lookup.setValue('');
            this.isPopupShown = true;
            this.selectedCreditAccountType = '';
            this.creditAccountAdded = false;

            this.initOperations();

            this.transferForm.patchValue({
              accountNumber: '',
              accountHolder: '',
              debit_description: '',
            });
            this.transferStep = 'first step';
            this.transferStepChange.emit('first step');
            this.creditAccount = null;
            this.bankService.updateTransaction(true);
            this.dialogService.openToast({
              type: 'success',
              title: '',
              message:
                response?.object?.response_message ??
                $localize`Transaction made successfully !`,
            });
          }
        },
        error: error => {
          this.dialogService.closeLoading();

          this.isAmountChanging = false;

          this.isLoading = false;
          this.dialogService.openToast({
            type: 'failed',
            title: '',
            message:
              error?.object?.response_message ??
              $localize`Something went wrong please retry again `,
          });
        },
      });
  }

  toggleBanksList() {
    this.isBanksListShown = !this.isBanksListShown;
  }

  switchBank(index: number) {
    this.selectedBank = this.banks[index];

    this.configService.setSelectedBank(index as unknown as bankModel);

    this.selectedDebitAccountType = '';
    this.debitAccount = null;
    this.debitWallet = null;
    this.selectedCreditAccountType = '';
    this.selectedInstitution = null;
    this.selectedInstitutionType = '';
  }

  deselectCreditAccount() {
    this.creditAccount = null;
    this.transferForm.patchValue({
      debit_description: '',
    });
  }

  showModal() {
    if (this.creditAccountAdded) {
      if (this.selectedCreditAccountType !== 'wallet') {
        if (this.selectedInstitution) {
          if (!this.selectedInstitution.api_values.has_lookup) {
            this.creditNumber = this.transferForm.value.accountNumber;
            this.creditName = this.transferForm.value.accountHolder;
          } else {
            this.creditNumber = this.creditAccount?.account_number;
            this.creditName = this.creditAccount?.name;
          }
        }
      } else if (this.selectedCreditAccountType === 'wallet') {
        this.creditNumber = this.creditAccount?.account_number;
        this.creditName = this.creditAccount?.name;
      }

      this.dialogService.openDialog({
        title: 'Confirm transfer',
        type: 'pin',
        message: ` Account 
             <b>${this.debitNumber}</b>
               of
             <b>${this.debitHolder}</b>  <br>  will be debited with 
               BIF 
            <b>${this.amount} </b>  <br>
               for the benefit of  account <br>
             <b>${this.creditNumber}</b>
               of 
              <b>${this.creditName}</b>
              `,
        action: 'confirm transfer',
      });
    }
  }

  initOperations() {
    this.transferForm.patchValue({
      accountNumber: '',
      accountHolder: '',
      debit_description: '',
      amount: null,
    });
  }

  toggleBalance() {
    this.dialogService.displayAmount();
  }

  getPopupOptions(event: PopupEventModel) {
    this.isPopupShown = event.isPopupShown;
  }

  completeCreditInfosOnType() {
    if (this.selectedCreditAccountType === 'wallet') {
      this.transferForm.patchValue({
        accountNumber: this.creditAccount?.account_number,
        accountHolder: this.creditAccount?.name,
      });
    }
  }
}
