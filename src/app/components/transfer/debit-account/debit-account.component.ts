import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  DoCheck,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { Subject, Observable } from 'rxjs';
import { UserInfoModel } from '../../../core/db/models/auth';
import {
  activeMainConfigModel,
  ModeModel,
  BankService,
  ConfigService,
  AuthService,
} from '../../../core/services';
import { userInfoModel } from '../../../layouts/header/model';
import { bankModel } from '../../../core/db/models/bank/bank.model';
import { SwitchBankComponent } from '../../../global/components/popups/switch-bank/switch-bank.component';
import { AccountsListComponent } from '../../account/accounts-list/accounts-list.component';
import { DebitEvent, DebitOptions, SwitchBankEvent } from '../transfer.model';

@Component({
  selector: 'app-debit-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkeletonComponent,
    SwitchBankComponent,
    AccountsListComponent,
  ],
  templateUrl: './debit-account.component.html',
  styleUrl: './debit-account.component.scss',
})
export class DebitAccountComponent implements OnInit, DoCheck, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  userInfo!: userInfoModel;
  clientInfo!: UserInfoModel;
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;
  private userInfo$: Observable<UserInfoModel>;
  mode!: ModeModel;
  mode$!: Observable<ModeModel>;
  debitAccount: DebitOptions | null = null;
  selectedDebitAccountType = '';
  lookupDebitAccountUrl = '/clients/list/all/object_lookup?lookup_data=';
  clientId: number | null = null;

  isLoading = false;
  debitWallet: DebitOptions | null = null;
  defaultBank: string | undefined;
  selectedBank!: bankModel;
  selectedBank$!: Observable<bankModel>;

  banks: bankModel[] = [];
  clientBanks: bankModel[] = [];

  index = 0;
  isBanksListShown = false;
  isBalanceShown = false;
  lookupType = '';
  @Output() debitOptions = new EventEmitter<DebitOptions>();
  @Output() amount = new EventEmitter<number>();
  @Output() lookupOptions = new EventEmitter<{
    id?: string;
    acc_holder?: string;
    acc_number?: string;
  }>();
  @Input() isTransactionDone = false;
  @Input() isGrey = false;
  @Input() title = 'Debit Account';
  @Input() creditAccountType = '';
  @Input() selectedInstitutionType = '';
  @Input() selectedInstitution = '';
  @Input() closedModal = false;
  @Input() isModalClosed = false;
  @Input() isWalletShown = true;
  @Input() isAccountShown = true;
  @Input() isTermDeposit = false;
  @Input() isOperation = false;
  @Input() isAmountChanging = false;
  lookup = new FormControl('');
  constructor(
    private bankService: BankService,
    private configService: ConfigService,
    private authService: AuthService
  ) {
    this.mode$ = this.configService.getMode();
    this.userInfo$ = this.authService.getUserInfo();
    this.mainConfig$ = this.configService.getMainConfig();
    this.selectedBank$ = this.configService.getSelectedBank();
  }
  ngOnInit() {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
    this.mode$.subscribe({
      next: datas => {
        this.mode = datas;
      },
    });
    this.userInfo$.subscribe({
      next: userinfo => {
        this.clientInfo = userinfo;
        this.clientId = this.clientInfo.client.id;
        this.selectedBank$.subscribe({
          next: datas => {
            this.selectedBank = datas;
          },
        });
      },
    });

    if (this.closedModal === true) {
      this.deselectDebitAccount();
    }
    this.getBanks();
  }
  ngDoCheck() {
    if (this.isTransactionDone) {
      this.updateAccount();
    }
    if (this.isModalClosed) {
      const options = {
        account: null,
        wallet: null,
        selectedDebitOption: '',
        creditAccountType: null,
        isTransferDone: this.isTransactionDone,
        isAmountChanging: false,
        selectedInstitutionType: '',
        selectedInstitution: '',
      };
      this.debitOptions.emit(options);
    }
  }
  getAccountsListByClick() {
    const data = {
      client_id: this.clientId,
      access_bank_id: this.selectedBank.id,
    };
    // this.transferService
    //     .getAccountsList()
    //     .pipe(takeUntil(this.onDestroy$))
    //     .subscribe((accounts: any) => {
    //         this.accounts = accounts.objects;
    //         //
    //     });
    console.log(data);
  }
  getBanks() {
    this.bankService.getBanksList().subscribe(banks => {
      this.clientBanks = banks;
    });
  }
  getAccountsListAutomatically() {
    this.isTransactionDone = false;
    const options: DebitOptions = {
      account: this.debitAccount ? this.debitAccount.account : null,
      wallet: null,
      selectedDebitOption: this.selectedDebitAccountType,
      creditAccountType: this.creditAccountType,
      isTransferDone: this.isTransactionDone,
      isAmountChanging: true,
      selectedInstitutionType: this.selectedInstitutionType,
      selectedInstitution: this.selectedInstitution,
    };
    this.debitOptions.emit(options);
    const data = {
      client_id: this.clientId,
      access_bank_id: this.selectedBank.id,
    };
    console.log(data);
    // this.transferService
    //     .getAccountsList()
    //     .pipe(takeUntil(this.onDestroy$))
    //     .subscribe((accounts: any) => {
    //         this.accounts = accounts.objects;
    //         this.selectDebitAccount(this.index);
    //         this.isTransactionDone = false;
    //         this.isAmountChanging = false;
    //         this.bankService.updateTransaction(true);
    //         const options = {
    //             account: this.debitAccount,
    //             wallet: null,
    //             selectedDebitOption: this.selectedDebitAccountType,
    //             creditAccountType: this.creditAccountType,
    //             isTransferDone: this.isTransactionDone,
    //             isAmountChanging: false,
    //             selectedInstitutionType: this.selectedInstitutionType,
    //             selectedInstitution: this.selectedInstitution,
    //         };
    //         this.debitOptions.emit(options);
    //         //
    //     });
  }
  getWalletsListByClick() {
    // this.transferService
    //     .getWalletsList(this.clientId)
    //     .pipe(takeUntil(this.onDestroy$))
    //     .subscribe((wallets: any) => {
    //         this.wallets = wallets.objects;
    //         //
    //     });
  }
  getWalletsListAutomatically() {
    this.isTransactionDone = false;
    const options: DebitOptions = {
      account: null,
      wallet: this.debitWallet ? this.debitWallet.wallet : null,
      selectedDebitOption: this.selectedDebitAccountType,
      creditAccountType: this.creditAccountType,
      isTransferDone: this.isTransactionDone,
      isAmountChanging: true,
      selectedInstitutionType: this.selectedInstitutionType,
      selectedInstitution: this.selectedInstitution,
    };
    this.debitOptions.emit(options);
    // this.transferService
    //     .getWalletsList(this.clientId)
    //     .pipe(takeUntil(this.onDestroy$))
    //     .subscribe((wallets: any) => {
    //         this.wallets = wallets.objects;
    //         this.isAmountChanging = false;
    //         //
    //         this.selectDebitWallet(this.index);
    //         this.isTransactionDone = false;
    //         const options = {
    //             account: null,
    //             wallet: this.debitWallet,
    //             selectedDebitOption: this.selectedDebitAccountType,
    //             creditAccountType: this.creditAccountType,
    //             isTransferDone: this.isTransactionDone,
    //             isAmountChanging: false,
    //             selectedInstitutionType: this.selectedInstitutionType,
    //             selectedInstitution: this.selectedInstitution,
    //         };
    //         this.debitOptions.emit(options);
    //     });
  }
  selectBank(bank: bankModel) {
    this.configService.setSelectedBank(bank);
  }
  getClient(client: DebitOptions) {
    this.debitAccount = client;
    const options = {
      id: this.debitAccount.id,
      acc_holder: this.debitAccount.lookup_title,
      acc_number: this.debitAccount.lookup_sub_title,
    };
    this.lookupOptions.emit(options);
  }
  selectDebitAccountType(accountType: string) {
    this.selectedDebitAccountType = accountType;
    const options = {
      account: null,
      wallet: null,
      selectedDebitOption: this.selectedDebitAccountType,
      creditAccountType: null,
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: this.selectedInstitutionType,
      selectedInstitution: this.selectedInstitution,
    };
    this.debitOptions.emit(options);
    if (accountType !== this.selectedDebitAccountType) {
      this.selectedDebitAccountType = '';
    }
    if (accountType == 'account') {
      // this.lookupType = 'lookup';
      if (this.mainConfig.activePlateform !== 'workstation') {
        this.getAccountsListByClick();
        this.lookupDebitAccountUrl =
          '/clients/manage/accounts/object_lookup?lookup_data=';
      }
      this.debitAccount = null;
    } else if (accountType == 'wallet') {
      if (this.mainConfig.activePlateform !== 'workstation') {
        this.getWalletsListByClick();
      }
      this.lookupType = 'lookup';
      this.lookupDebitAccountUrl = '/dbs/wallets/object_lookup?lookup_data=';
      this.debitAccount = null;
    } else if (accountType == 'internal') {
      this.lookupType = 'autocomplete';
      this.lookupDebitAccountUrl = '/ledger/objects_autocomplete?search=';
      this.debitAccount = null;
    } else if (accountType == 'treasury') {
      this.lookupType = 'autocomplete';
      this.lookupDebitAccountUrl =
        '/treasury/institutions/manage/objects_autocomplete?search=';
      this.debitAccount = null;
    } else if (accountType == 'agent') {
      this.lookupType = 'lookup';
      this.lookupDebitAccountUrl = '/dbs/agents/object_lookup?lookup_data=';
      this.debitAccount = null;
    } else if (accountType == 'merchant') {
      this.lookupType = 'lookup';
      this.lookupDebitAccountUrl =
        '/dbs/merchant/manage/object_lookup?lookup_data=';
      this.debitAccount = null;
    }
  }
  deselectDebitAccount() {
    this.debitAccount = null;
    this.debitWallet = null;
    const options = {
      account: null,
      wallet: null,
      selectedDebitOption: this.selectedDebitAccountType,
      creditAccountType: null,
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: this.selectedInstitutionType,
      selectedInstitution: this.selectedInstitution,
    };
    this.debitOptions.emit(options);
  }
  selectDebitAccount(index: number) {
    this.index = index;
    const options: DebitOptions = {
      account: this.debitAccount ? this.debitAccount.account : null,
      wallet: null,
      selectedDebitOption: this.selectedDebitAccountType,
      creditAccountType: null,
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: this.selectedInstitutionType,
      selectedInstitution: this.selectedInstitution,
    };
    this.debitOptions.emit(options);
  }
  updateAccount() {
    const options: DebitOptions = {
      account: this.debitAccount ? this.debitAccount.account : null,
      wallet: this.debitWallet ? this.debitWallet.wallet : null,
      selectedDebitOption: this.selectedDebitAccountType,
      creditAccountType: this.creditAccountType,
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: this.selectedInstitutionType,
      selectedInstitution: this.selectedInstitution,
    };
    this.debitOptions.emit(options);
    if (this.selectedDebitAccountType === 'account') {
      this.getAccountsListAutomatically();
    }
    if (this.selectedDebitAccountType === 'wallet') {
      this.getWalletsListAutomatically();
    }
  }
  selectDebitWallet(index: number) {
    this.index = index;
    const options: DebitOptions = {
      account: null,
      wallet: this.debitWallet ? this.debitWallet.wallet : null,
      selectedDebitOption: this.selectedDebitAccountType,
      creditAccountType: null,
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: this.selectedInstitutionType,
      selectedInstitution: this.selectedInstitution,
    };
    this.debitOptions.emit(options);
  }
  toggleBanksList() {
    this.isBanksListShown = !this.isBanksListShown;
  }

  getSwitchBankOptions(event: SwitchBankEvent) {
    const options = {
      account: null,
      wallet: null,
      selectedDebitOption: '',
      creditAccountType: event.creditAccountType || '',
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: this.selectedInstitutionType,
      selectedInstitution: this.selectedInstitution,
    };
    this.debitOptions.emit(options);
    this.selectedDebitAccountType = event.selectedDebitAccountType ?? '';
    this.debitAccount = event.debitAccount as DebitOptions;
    this.debitWallet = event.debitWallet as DebitOptions;
    this.banks = event.banks;
  }

  toggleBalance() {
    this.isBalanceShown = !this.isBalanceShown;
  }
  getIndividualClient(event: DebitEvent) {
    const options: DebitOptions = {
      account: event.account,
      wallet: null,
      selectedDebitOption: this.selectedDebitAccountType,
      creditAccountType: event.creditAccountType,
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: this.selectedInstitutionType,
      selectedInstitution: this.selectedInstitution,
    };
    this.debitOptions.emit(options);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    const options = {
      account: null,
      wallet: null,
      selectedDebitOption: '',
      creditAccountType: null,
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: '',
      selectedInstitution: '',
    };
    this.debitOptions.emit(options);
  }
}
