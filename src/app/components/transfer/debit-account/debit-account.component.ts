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
import { BankModel } from '../../../core/db/models/bank/bank.model';
import { SwitchBankComponent } from '../../../global/components/popups/switch-bank/switch-bank.component';
import { AccountsListComponent } from '../../account/accounts-list/accounts-list.component';
import {
  DebitIndividualEventModel,
  DebitOptionsModel,
  InstitutionInfoModel,
} from '../transfer.model';
import { WalletListComponent } from '../../wallet/wallet-list/wallet-list.component';
import {
  activeMainConfigModel,
  ModeModel,
} from '../../../core/services/config/main-config.models';
import { accountsList } from '../../account/models';
import { WalletList } from '../../wallet/wallet.models';
import { BankOptionsModel } from '../../dashboards/dashboard.model';

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
  clientInfo!: UserInfoModel;
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;
  private userInfo$: Observable<UserInfoModel>;
  mode!: ModeModel;
  mode$!: Observable<ModeModel>;
  debitAccount: DebitOptionsModel | null = null;
  @Input() selectedDebitAccountType = '';
  lookupDebitAccountUrl = '/clients/list/all/object_lookup?lookup_data=';
  clientId: number | null = null;

  debitWallet: DebitOptionsModel | null = null;
  defaultBank: string | undefined;
  @Input() selectedBank!: BankModel;
  selectedBank$!: Observable<BankModel>;

  banks: BankModel[] = [];
  clientBanks: BankModel[] = [];

  index = 0;
  isBalanceShown = false;
  isBalanceShown$: Observable<boolean>;

  lookupType = '';
  @Output() debitOptions = new EventEmitter<{
    account: string;

    wallet: string;

    selectedDebitOption: string;

    creditAccountType: string;
    isTransferDone: boolean;
    isAmountChanging: boolean;
    selectedInstitutionType: string;
    selectedInstitution: InstitutionInfoModel | string;
  }>();

  @Output() selectedAccount = new EventEmitter<accountsList>();

  @Output() selectedWallet = new EventEmitter<WalletList>();

  @Output() lookupOptions = new EventEmitter<{
    id?: string;
    acc_holder?: string;
    acc_number?: string;
  }>();
  @Input() isTransactionDone = false;
  @Input() title = 'Debit Account';
  @Input() creditAccountType = '';
  @Input() selectedInstitutionType = '';
  @Input() selectedInstitution: InstitutionInfoModel | string = '';
  @Input() closedModal = false;
  @Input() isModalClosed = false;
  @Input() isWalletShown = true;
  @Input() isAccountShown = true;
  @Input() isTermDeposit = false;
  @Input() isOperation = false;
  lookup = new FormControl('');

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isTransactionDone'] && this.isTransactionDone) {
      this.updateAccount();
    }

    if (changes['isModalClosed'] && this.isModalClosed) {
      const options = {
        account: '',
        wallet: '',
        selectedDebitOption: '',
        creditAccountType: '',
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

  selectBank(bank: BankModel) {
    this.configService.setSelectedBank(bank);
  }
  getClient(client: DebitOptionsModel) {
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
      account: '',
      wallet: '',
      selectedDebitOption: this.selectedDebitAccountType,
      creditAccountType: '',
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: this.selectedInstitutionType,
      selectedInstitution: this.selectedInstitution,
    };
    this.debitOptions.emit(options);
    if (accountType !== this.selectedDebitAccountType) {
      this.selectedDebitAccountType = '';
    }
  }

  updateAccount() {
    const options = {
      account: this.debitAccount ? this.debitAccount.account : '',
      wallet: this.debitWallet ? this.debitWallet.wallet : '',
      selectedDebitOption: this.selectedDebitAccountType,
      creditAccountType: this.creditAccountType,
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: this.selectedInstitutionType,
      selectedInstitution: this.selectedInstitution,
    };
    this.debitOptions.emit(options);
  }

  getSwitchBankOptions(event: BankOptionsModel) {
    const options = {
      account: '',
      wallet: '',
      selectedDebitOption: '',
      creditAccountType: event.creditAccountType || '',
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: this.selectedInstitutionType,
      selectedInstitution: this.selectedInstitution,
    };
    this.debitOptions.emit(options);
    this.selectedDebitAccountType = event.selectedDebitAccountType ?? '';
    this.debitAccount = event.debitAccount as unknown as DebitOptionsModel;
    this.debitWallet = event.debitWallet as unknown as DebitOptionsModel;
    this.banks = event.banks;
  }

  toggleBalance() {
    this.dialogService.displayAmount();
  }
  getIndividualClient(event: DebitIndividualEventModel) {
    const options = {
      account: event.account,
      wallet: '',
      selectedDebitOption: this.selectedDebitAccountType,
      creditAccountType: event.creditAccountType ?? '',
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: this.selectedInstitutionType,
      selectedInstitution: this.selectedInstitution,
    };
    this.debitOptions.emit(options);
  }

  getAccountSelected(event: accountsList | WalletList) {
    if (this.selectedDebitAccountType === 'account') {
      this.selectedAccount.emit(event as accountsList);
    } else {
      this.selectedWallet.emit(event as WalletList);
    }
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    const options = {
      account: '',
      wallet: '',
      selectedDebitOption: '',
      creditAccountType: '',
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: '',
      selectedInstitution: '',
    };
    this.debitOptions.emit(options);
  }
}
