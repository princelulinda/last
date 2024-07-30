import { CommonModule, NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { Subject, Observable } from 'rxjs';
import { UserInfoModel } from '../../../core/db/models/auth';
import {
  BankService,
  ConfigService,
  AuthService,
  DialogService,
} from '../../../core/services';
import { userInfoModel } from '../../../layouts/header/model';
import { bankModel } from '../../../core/db/models/bank/bank.model';
import { SwitchBankComponent } from '../../../global/components/popups/switch-bank/switch-bank.component';
import { AccountsListComponent } from '../../account/accounts-list/accounts-list.component';
import { DebitEvent, DebitOptions, SwitchBankEvent } from '../transfer.model';
import { WalletListComponent } from '../../wallet/wallet-list/wallet-list.component';
import {
  activeMainConfigModel,
  ModeModel,
} from '../../../core/services/config/main-config.models';

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
    WalletListComponent,
    NgClass,
  ],
  templateUrl: './debit-account.component.html',
  styleUrl: './debit-account.component.scss',
})
export class DebitAccountComponent implements OnInit, OnDestroy, OnChanges {
  private onDestroy$: Subject<void> = new Subject<void>();
  userInfo!: userInfoModel;
  clientInfo!: UserInfoModel;
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;
  private userInfo$: Observable<UserInfoModel>;
  mode!: ModeModel;
  mode$!: Observable<ModeModel>;
  debitAccount: DebitOptions | null = null;
  @Input() selectedDebitAccountType = '';
  lookupDebitAccountUrl = '/clients/list/all/object_lookup?lookup_data=';
  clientId: number | null = null;

  debitAccounts: DebitOptions[] = [];
  debitWallet: DebitOptions | null = null;
  defaultBank: string | undefined;
  @Input() selectedBank!: bankModel;
  selectedBank$!: Observable<bankModel>;

  banks: bankModel[] = [];
  clientBanks: bankModel[] = [];

  index = 0;
  isBalanceShown = false;
  isBalanceShown$: Observable<boolean>;

  lookupType = '';
  @Output() debitOptions = new EventEmitter<{
    // eslint-disable-next-line
    account: any;
    // eslint-disable-next-line
    wallet: any;
    // eslint-disable-next-line
    selectedDebitOption: any;
    // eslint-disable-next-line
    creditAccountType: any;
    isTransferDone: boolean;
    isAmountChanging: boolean;
    selectedInstitutionType: string;
    selectedInstitution: string;
  }>();
  // eslint-disable-next-line
  @Output() selectedAccount = new EventEmitter<any>();
  // eslint-disable-next-line
  @Output() selectedWallet = new EventEmitter<any>();

  @Output() lookupOptions = new EventEmitter<{
    id?: string;
    acc_holder?: string;
    acc_number?: string;
  }>();
  @Input() isTransactionDone = false;
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
  lookup = new FormControl('');
  //eslint-disable-next-line
  wallets: any;
  constructor(
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
    this.isBalanceShown$.subscribe(isBalanceShown => {
      this.isBalanceShown = isBalanceShown;
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

    this.getBanks();
  }

  // ngDoCheck() {
  //   if (this.isTransactionDone) {
  //     this.updateAccount();
  //   }
  //   if (this.isModalClosed) {
  //     const options = {
  //       account: null,
  //       wallet: null,
  //       selectedDebitOption: '',
  //       creditAccountType: null,
  //       isTransferDone: this.isTransactionDone,
  //       isAmountChanging: false,
  //       selectedInstitutionType: '',
  //       selectedInstitution: '',
  //     };
  //     this.debitOptions.emit(options);
  //   }
  // }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isTransactionDone'] && this.isTransactionDone) {
      this.updateAccount();
    }

    if (changes['isModalClosed'] && this.isModalClosed) {
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

    console.log(data);
  }
  getBanks() {
    this.bankService.getBanksList().subscribe(banks => {
      this.clientBanks = banks;
    });
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
      this.lookupType = 'lookup';
      this.lookupDebitAccountUrl = '/dbs/wallets/object_lookup?lookup_data=';
      this.debitAccount = null;
    }
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
    this.dialogService.displayAmount();
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

  // eslint-disable-next-line
  getAccountSelected(event: any) {
    if (this.selectedDebitAccountType === 'account') {
      this.selectedAccount.emit(event);
    } else {
      this.selectedWallet.emit(event);
    }
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
