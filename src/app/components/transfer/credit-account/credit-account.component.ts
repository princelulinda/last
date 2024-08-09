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
  MerchantService,
} from '../../../core/services';
import { TransferService } from '../../../core/services/transfer/transfer.service';
import { AmountFieldComponent } from '../../../global/components/custom-field/amount-field/amount-field.component';
import { UserInfoModel } from '../../../core/db/models/auth';
import {
  activeMainConfigModel,
  ModeModel,
} from '../../../core/services/config/main-config.models';
import { userInfoModel } from '../../../layouts/header/model';
import { bankModel } from '../../../core/db/models/bank/bank.model';
import {
  AmountEventModel,
  CreditAccountModel,
  CreditDetail,
  DebitAccountModel,
  DebitOptions,
  DebitWalletModel,
  InstitutionInfoModel,
  LookupData,
  LookupResponseModel,
  PopupEventModel,
  TransferResponseModel,
} from '../transfer.model';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import { MerchantObjectModel } from '../../products/products.model';

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
  isLoading = false;
  debitWallet: DebitWalletModel | null = null;

  defaultBank: bankModel | null | undefined;

  banks: bankModel[] = [];

  @Input() debitNumber = '';

  @Input() debitHolder = '';
  amount: number | null = null;
  amountToSend: number | null = null;
  clientId: number | null = null;

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

  creditAccount: CreditAccountModel | null | undefined;
  transferForm = new FormGroup({
    accountNumber: new FormControl('', Validators.required),
    accountHolder: new FormControl('', Validators.required),
    debit_description: new FormControl('', Validators.required),
    amount: new FormControl(this.amount, Validators.required),
    merchant_reference: new FormControl(''),
  });

  dialog$: Observable<DialogResponseModel>;
  pin = '';

  lookupData: LookupData | null = null;

  @Input() isMerchantTransfer = false;
  @Input() isOperation = false;
  @Input() showBack = false;
  @Input() bankId!: bankModel;
  @Input() simpleTransferTitle = true;
  userInfo!: userInfoModel;
  clientInfo!: UserInfoModel;
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;
  private userInfo$: Observable<UserInfoModel>;
  mode!: ModeModel;
  mode$!: Observable<ModeModel>;

  merchantInfo: MerchantObjectModel | null = null;
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
    private dialogService: DialogService,
    private merchantService: MerchantService
  ) {
    this.mode$ = this.configService.getMode();
    this.userInfo$ = this.authService.getUserInfo();
    this.mainConfig$ = this.configService.getMainConfig();
    this.selectedBank$ = this.configService.getSelectedBank();
    this.isBalanceShown$ = this.dialogService.getAmountState();
    this.dialog$ = this.dialogService.getDialogState();
  }

  ngOnInit() {
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
          if (!this.isMerchantTransfer) {
            this.validateTransfer();
          } else {
            this.doMerchantTransfer();
          }
        }
      },
    });

    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });

    this.selectedCreditAccountType = '';

    if (this.isMerchantTransfer) {
      this.getConnectedMerchantInfo();
    }
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
    this.pendingTransfers = this.pendingTransfers.filter(
      account => account.account_number !== accountNumber
    );

    if (this.pendingTransfers.length === 0) {
      this.creditAccountAdded = false;
    }
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

  validateTransfer() {
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

            this.isAmountChanging = false;
            this.lookup.setValue('');
            this.isPopupShown = true;
            this.selectedCreditAccountType = '';

            this.initOperations();

            this.transferForm.patchValue({
              accountNumber: '',
              accountHolder: '',
              debit_description: '',
            });

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

  doMerchantTransfer() {
    this.isAmountChanging = true;

    if (this.selectedCreditAccountType === 'wallet') {
      this.creditNumber = this.creditAccount?.account_number;
      this.creditName = this.creditAccount?.name;
      this.selectedInstitution = this
        .defaultBank as unknown as InstitutionInfoModel;
    } else {
      this.creditNumber = this.transferForm.value.accountNumber;
      this.creditName = this.transferForm.value.accountHolder;
    }

    const data = {
      amount: this.amount,
      credit_account: this.transferForm.value.accountNumber,
      credit_account_holder: this.transferForm.value.accountHolder,
      credit_bank: this.selectedInstitution?.slug,
      credit_type: this.selectedCreditAccountType,
      pin_code: this.pin,
      description: this.transferForm.value.debit_description,
      merchant_reference: this.transferForm.value.merchant_reference,
    };

    this.dialogService.dispatchLoading();

    this.merchantService
      .merchantCashin(data)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.dialogService.dispatchLoading();

          this.isLoading = false;
          this.pin = '';

          if (response.object.success === true) {
            this.isTransferDone.emit(true);

            this.isAmountChanging = false;
            this.transferResponse = response.object
              .response_data as unknown as TransferResponseModel;
            // this.successMessage = {
            //   data: {
            //     credit_account: this.creditNumber,
            //     credit_bank: this.selectedInstitution.name,
            //     credit_account_holder: this.transferForm.value.accountHolder,
            //     reference: this.transferResponse.reference,
            //     bank_reference: this.transferResponse.bank_reference,
            //     amount: this.amount,
            //     transfer_fees: 0,
            //     bill_date: Date.now(),
            //     debit_bank: this.defaultBank?.name,
            //     debit_account_holder:
            //       this.merchantInfo.response_data.merchant_title,
            //     description: this.transferForm.value.debit_description,
            //   },
            // };

            // this.store.dispatch(
            //     new OpenTransfertBillPopup(this.successMessage.data)
            // );
            this.lookup.setValue('');
            this.isPopupShown = true;
            this.selectedCreditAccountType = '';

            this.initOperations();
          } else if (response.object.success === false) {
            this.isAmountChanging = false;
            this.transferForm.value.amount = null;
            this.dialogService.openToast({
              type: 'failed',
              title: '',
              message:
                response?.object?.response_message ??
                $localize`Something went wrong please retry again !`,
            });
          }
        },
        error: err => {
          this.dialogService.closeLoading();

          this.isAmountChanging = false;

          this.isLoading = false;
          this.dialogService.openToast({
            type: 'failed',
            title: 'Échec',
            message:
              err?.object?.response_message ??
              $localize`Something went wrong please retry again !`,
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
      merchant_reference: '',
    });
  }

  getDebitOptions(event: DebitOptions) {
    this.debitAccount = event.account as unknown as DebitAccountModel | null;
    this.debitWallet = event.wallet as unknown as DebitWalletModel | null;
    this.selectedDebitAccountType = event.selectedDebitOption;
    this.selectedCreditAccountType = event.creditAccountType;
    this.isTransferDone.emit(event.isTransferDone);
    this.isAmountChanging = event.isAmountChanging;
    this.selectedInstitutionType = event.selectedInstitutionType;
    this.selectedInstitution =
      event.selectedInstitution as InstitutionInfoModel;

    if (!this.selectedCreditAccountType) {
      this.selectedCreditAccountType = '';
      this.selectedInstitution = null;
      this.selectedInstitutionType = '';
      this.creditAccount = null;
    }
  }

  showModal(event: Event) {
    event.preventDefault();
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

      if (!this.isMerchantTransfer) {
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
      } else {
        this.dialogService.openDialog({
          title: 'Confirm transfer',
          type: 'pin',
          message: ` Confirm your transfer of <b>${this.amount} BIF</b> for the benefit of <b>${this.transferForm.value.accountHolder} <small>${this.creditNumber}</small></b> `,
          action: 'confirm transfer',
        });
      }
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
  getConnectedMerchantInfo() {
    this.merchantService.getConnectedMerchantInfo().subscribe({
      next: (merchantInfo: MerchantObjectModel) => {
        if (merchantInfo.object.success) {
          this.merchantInfo = merchantInfo;
        } else {
          this.dialogService.openToast({
            type: 'failed',
            title: '',
            message: $localize`Something went wrong, please retry again`,
          });
        }
      },
      error: () => {
        this.dialogService.openToast({
          type: 'failed',
          title: '',
          message: $localize`An error occurred, please try again`,
        });
      },
    });
  }
}
